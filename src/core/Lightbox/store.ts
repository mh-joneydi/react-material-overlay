import { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import { ILightboxContainerProps, ILightboxDefaultOptions, ILightboxProps, INotValidatedLightboxProps } from './types';

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

export function buildLightbox(options: INotValidatedLightboxProps) {
	if (!hasContainers()) {
		throw new Error('there is no container for push new lightbox!');
	}

	const id = options.containerId || Default.CONTAINER_ID;

	const container = containers.get(id);

	if (!container) {
		throw new Error(`there is no container with id: ${id} for push new lightbox!`);
	}

	return container.buildLightbox(options);
}

export function pushLightbox(lightbox: ILightboxProps) {
	containers.get(lightbox.containerId)?.pushLightbox(lightbox);
}

export function popLightbox(containerId: Id = Default.CONTAINER_ID) {
	containers.get(containerId)?.popLightbox();
}

export function registerLightboxContainer({ defaultOptions, containerId }: ILightboxContainerProps) {
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
		setDefaultOptions(d: ILightboxDefaultOptions) {
			containers.get(id)?.setDefaultOptions(d);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
