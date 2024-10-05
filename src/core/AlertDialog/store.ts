import { IAlertDialogContainerProps, Id, INotValidatedAlertDialogProps, Notify } from '../../types';
import { Default } from '../../utils/constant';

import { ContainerObserver, createContainerObserver } from './containerObserver';

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

export function pushAlertDialog(options: INotValidatedAlertDialogProps): boolean {
	if (!hasContainers()) {
		return false;
	}

	let pushed = false;

	containers.forEach((c) => {
		const _pushed = c.buildAlertDialog(options);

		if (_pushed) {
			pushed = true;
		}
	});

	return pushed;
}

export function popAlertDialog(containerId: Id) {
	containers.get(containerId)?.popAlertDialog();
}

export function registerAlertDialogContainer(props: IAlertDialogContainerProps) {
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
		setProps(p: IAlertDialogContainerProps) {
			containers.get(id)?.setProps(p);
		},
		getSnapshot() {
			return containers.get(id)?.getSnapshot();
		}
	};
}
