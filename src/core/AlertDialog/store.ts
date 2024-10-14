import { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';

import { ContainerObserver, createContainerObserver } from './containerObserver';
import {
	IAlertDialogContainerProps,
	IAlertDialogDefaultOptions,
	IAlertDialogProps,
	INotValidatedAlertDialogProps
} from './types';

const containers = new Map<Id, ContainerObserver>();

const hasContainers = () => containers.size > 0;

export function isAlertDialogActive(id: Id, containerId?: Id) {
	if (containerId) {
		return !!containers.get(containerId)?.isAlertDialogActive(id);
	}

	let isActive = false;
	containers.forEach((c) => {
		if (c.isAlertDialogActive(id)) {
			isActive = true;
		}
	});

	return isActive;
}

export function buildAlertDialog(options: INotValidatedAlertDialogProps) {
	if (!hasContainers()) {
		throw new Error('there is no container for push new alert dialog!');
	}

	const id = options.containerId || Default.CONTAINER_ID;

	const container = containers.get(id);

	if (!container) {
		throw new Error(`there is no container with id: ${id} for push new alert dialog!`);
	}

	return container.buildAlertDialog(options);
}

export function pushAlertDialog(alertDialog: IAlertDialogProps) {
	containers.get(alertDialog.containerId)?.pushAlertDialog(alertDialog);
}

export function popAlertDialog(containerId: Id = Default.CONTAINER_ID) {
	containers.get(containerId)?.popAlertDialog();
}

export function registerAlertDialogContainer({ defaultOptions, containerId }: IAlertDialogContainerProps) {
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
		setDefaultOptions(d: IAlertDialogDefaultOptions) {
			containers.get(id)?.setDefaultOptions(d);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
