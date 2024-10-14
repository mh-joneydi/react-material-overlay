import { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import { canBeRendered } from '../../utils/propValidator';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import { IModal, IModalContainerProps, IModalDefaultOptions, INotValidatedModalProps, ModalContent } from './types';

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

export function buildModal(content: ModalContent, options: INotValidatedModalProps) {
	if (!canBeRendered(content)) {
		throw new Error('modal contnet can not be rendered!');
	}

	if (!hasContainers()) {
		throw new Error('there is no container for push new modal!');
	}

	const id = options.containerId || Default.CONTAINER_ID;

	const container = containers.get(id);

	if (!container) {
		throw new Error(`there is no container with id: ${id} for push new modal!`);
	}

	return container.buildModal(content, options);
}

export function pushModal(modal: IModal) {
	containers.get(modal.props.containerId)?.pushModal(modal);
}

export function popModal(containerId: Id = Default.CONTAINER_ID) {
	containers.get(containerId)?.popModal();
}

export function registerModalContainer({ defaultOptions, containerId }: IModalContainerProps) {
	const id = containerId || Default.CONTAINER_ID;

	return {
		subscribe(notify: Notify) {
			const container = createContainerObserver(id, defaultOptions);

			containers.set(id, container);

			const unobserve = container.observe(notify);

			return () => {
				unobserve();
				containers.delete(id);
			};
		},
		setDefaultOptions(d: IModalDefaultOptions) {
			containers.get(id)?.setDefaultOptions(d);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
