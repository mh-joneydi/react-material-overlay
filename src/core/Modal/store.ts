import {
	Id,
	IModalContainerProps,
	IModalOptions,
	INotValidatedModalProps,
	IPopModalPayload,
	IPushModalPayload,
	Notify
} from '../../types';
import { Default, Events } from '../../utils/constant';
import EventEmitter from '../../utils/EventEmitter';
import { canBeRendered, isNum, isStr } from '../../utils/propValidator';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import { genModalId } from './genModalId';

const containers = new Map<Id, ContainerObserver>();

const hasContainers = () => containers.size > 0;

export function isModalActive(id: Id, containerId?: Id) {
	if (containerId) {
		return !!containers.get(containerId)?.isModalActive(id);
	}

	let isActive = false;
	containers.forEach((c) => {
		if (c.isModalActive(id)) {
			isActive = true;
		}
	});

	return isActive;
}

/**
 * Generate a modalId or use the one provided
 */
function getModalId(options?: IModalOptions) {
	return options && (isStr(options.modalId) || isNum(options.modalId)) ? options.modalId : genModalId();
}

/**
 * Merge provided options with the defaults settings and generate the modalId
 */
function mergeOptions(options?: IModalOptions) {
	return {
		...options,
		modalId: getModalId(options)
	} as INotValidatedModalProps;
}

EventEmitter.on<[IPushModalPayload]>(Events.PushModal, ({ content, options, sequenceNumber }) => {
	if (!canBeRendered(content) || !hasContainers()) {
		return;
	}

	containers.forEach((c) => {
		c.buildModal(content, mergeOptions(options), sequenceNumber);
	});
});

EventEmitter.on<[IPopModalPayload]>(Events.PopModal, ({ containerId }) => {
	containers.get(containerId)?.popModal();
});

export function registerModalContainer(props: IModalContainerProps) {
	const id = props.containerId || Default.CONTAINER_ID;

	return {
		subscribe(notify: Notify) {
			const container = createContainerObserver(id, props);

			containers.set(id, container);

			const unobserve = container.observe(notify);

			return () => {
				unobserve();
				containers.delete(id);
			};
		},
		setProps(p: IModalContainerProps) {
			containers.get(id)?.setProps(p);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
