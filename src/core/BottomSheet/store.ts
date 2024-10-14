import { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import { canBeRendered } from '../../utils/propValidator';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import {
	BottomSheetContent,
	IBottomSheet,
	IBottomSheetContainerProps,
	IBottomSheetDefaultOptions,
	INotValidatedBottomSheetProps
} from './types';

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

export function buildBottomSheet(content: BottomSheetContent, options: INotValidatedBottomSheetProps) {
	if (!canBeRendered(content)) {
		throw new Error('bottom sheet contnet can not be rendered!');
	}

	if (!hasContainers()) {
		throw new Error('there is no container for push new bottom sheet!');
	}

	const id = options.containerId || Default.CONTAINER_ID;

	const container = containers.get(id);

	if (!container) {
		throw new Error(`there is no container with id: ${id} for push new bottom sheet!`);
	}

	return container.buildBottomSheet(content, options);
}

export function pushBottomSheet(bottomSheet: IBottomSheet) {
	containers.get(bottomSheet.props.containerId)?.pushBottomSheet(bottomSheet);
}

export function popBottomSheet(containerId: Id = Default.CONTAINER_ID) {
	containers.get(containerId)?.popBottomSheet();
}

export function registerBottomSheetContainer({ defaultOptions, containerId }: IBottomSheetContainerProps) {
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
		setDefaultOptions(d: IBottomSheetDefaultOptions) {
			containers.get(id)?.setDefaultOptions(d);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
