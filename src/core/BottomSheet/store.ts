import { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import { canBeRendered } from '../../utils/propValidator';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import { BottomSheetContent, IBottomSheetContainerProps, INotValidatedBottomSheetProps } from './types';

const containers = new Map<Id, ContainerObserver>();

const hasContainers = () => containers.size > 0;

export function isBottomSheetActive(id: Id, containerId?: Id) {
	if (containerId) {
		return !!containers.get(containerId)?.isBottomSheetActive(id);
	}

	let isActive = false;
	containers.forEach((c) => {
		if (c.isBottomSheetActive(id)) {
			isActive = true;
		}
	});

	return isActive;
}

export function pushBottomSheet(content: BottomSheetContent, options: INotValidatedBottomSheetProps): boolean {
	if (!canBeRendered(content) || !hasContainers()) {
		return false;
	}

	let pushed = false;

	containers.forEach((c) => {
		const _pushed = c.buildBottomSheet(content, options);

		if (_pushed) {
			pushed = true;
		}
	});

	return pushed;
}

export function popBottomSheet(containerId: Id) {
	containers.get(containerId)?.popBottomSheet();
}

export function registerBottomSheetContainer(props: IBottomSheetContainerProps) {
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
		setProps(p: IBottomSheetContainerProps) {
			containers.get(id)?.setProps(p);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
