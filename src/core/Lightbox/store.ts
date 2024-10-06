import { Id, ILightboxContainerProps, INotValidatedLightboxProps, Notify } from '../../types';
import { Default } from '../../utils/constant';

import { ContainerObserver, createContainerObserver } from './containerObserver';

const containers = new Map<Id, ContainerObserver>();

const hasContainers = () => containers.size > 0;

export function isLightboxActive(id: Id, containerId?: Id) {
	if (containerId) {
		return !!containers.get(containerId)?.isLightboxActive(id);
	}

	let isActive = false;
	containers.forEach((c) => {
		if (c.isLightboxActive(id)) {
			isActive = true;
		}
	});

	return isActive;
}

export function pushLightbox(options: INotValidatedLightboxProps): boolean {
	if (!hasContainers()) {
		return false;
	}

	let pushed = false;

	containers.forEach((c) => {
		const _pushed = c.buildLightbox(options);

		if (_pushed) {
			pushed = true;
		}
	});

	return pushed;
}

export function popLightbox(containerId: Id) {
	containers.get(containerId)?.popLightbox();
}

export function registerLightboxContainer(props: ILightboxContainerProps) {
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
		setProps(p: ILightboxContainerProps) {
			containers.get(id)?.setProps(p);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
