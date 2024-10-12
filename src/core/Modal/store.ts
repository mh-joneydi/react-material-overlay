import { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import { canBeRendered } from '../../utils/propValidator';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import { IModalContainerProps, INotValidatedModalProps, ModalContent } from './types';

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

export function pushModal(content: ModalContent, options: INotValidatedModalProps): boolean {
	if (!canBeRendered(content) || !hasContainers()) {
		return false;
	}

	let pushed = false;

	containers.forEach((c) => {
		const _pushed = c.buildModal(content, options);

		if (_pushed) {
			pushed = true;
		}
	});

	return pushed;
}

export function popModal(containerId: Id) {
	containers.get(containerId)?.popModal();
}

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
