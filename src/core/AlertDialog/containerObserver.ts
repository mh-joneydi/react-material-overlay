import { merge } from 'lodash';

import type {
	IAlertDialogContainerProps,
	IAlertDialogProps,
	Id,
	INotValidatedAlertDialogProps,
	Notify
} from '../../types';
import { Default } from '../../utils/constant';
import mergeClasses from '../../utils/mergeClasses';
import { isFn } from '../../utils/propValidator';
import { popRMOStackState } from '../RMO';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(id: Id, containerProps: IAlertDialogContainerProps) {
	let alertDialogCount = 0;
	let activeAlertDialogs: Id[] = [];
	let snapshot: IAlertDialogProps[] = [];
	let props = containerProps;

	const alertDialogs = new Map<Id, IAlertDialogProps>();
	const listeners = new Set<Notify>();

	const observe = (notify: Notify) => {
		listeners.add(notify);
		return () => listeners.delete(notify);
	};

	const notify = () => {
		snapshot = Array.from(alertDialogs.values());
		listeners.forEach((cb) => cb());
	};

	const shouldIgnore = ({ containerId, alertDialogId }: INotValidatedAlertDialogProps) => {
		const containerMismatch = containerId ? containerId !== id : id !== Default.CONTAINER_ID;
		const isDuplicate = alertDialogs.has(alertDialogId);

		return containerMismatch || isDuplicate;
	};

	const popAlertDialog = () => {
		activeAlertDialogs = activeAlertDialogs.slice(0, -1);
		notify();
	};

	const pushAlertDialog = async (alertDialog: IAlertDialogProps) => {
		const { alertDialogId, onOpen } = alertDialog;

		alertDialogs.set(alertDialogId, alertDialog);
		activeAlertDialogs = [...activeAlertDialogs, alertDialogId];

		notify();

		if (isFn(onOpen)) {
			onOpen();
		}
	};

	const buildAlertDialog = (options: INotValidatedAlertDialogProps): boolean => {
		if (shouldIgnore(options)) {
			return false;
		}

		const { alertDialogId } = options;

		const closeAlertDialog = () => {
			popAlertDialog();
			popRMOStackState({ type: 'alertDialog', containerId: id, alertDialogId });
		};

		alertDialogCount++;

		const { sx: defaultSx, classes: defaultClasses, ...containerProps } = props;

		const { classes, ...alertDialogOptions } = options;

		const alertDialogProps = {
			...merge({}, containerProps, Object.fromEntries(Object.entries(alertDialogOptions).filter(([, v]) => v != null))),
			alertDialogId,
			containerId: id,
			closeAlertDialog,
			deleteAlertDialog() {
				const alertDialogToRemove = alertDialogs.get(alertDialogId)!;
				const { onClose } = alertDialogToRemove;

				if (isFn(onClose)) {
					onClose();
				}

				alertDialogs.delete(alertDialogId);

				alertDialogCount--;

				if (alertDialogCount < 0) {
					alertDialogCount = 0;
				}

				notify();
			}
		} as IAlertDialogProps;

		if (isFn(classes)) {
			alertDialogProps.classes = classes(defaultClasses);
		} else if (defaultClasses && classes) {
			alertDialogProps.classes = mergeClasses(defaultClasses, classes);
		} else if (defaultClasses) {
			alertDialogProps.classes = defaultClasses;
		} else {
			alertDialogProps.classes = classes;
		}

		pushAlertDialog(alertDialogProps);

		return true;
	};

	return {
		id,
		props,
		observe,
		popAlertDialog,
		get alertDialogCount() {
			return alertDialogCount;
		},
		buildAlertDialog,
		setProps(p: IAlertDialogContainerProps) {
			props = p;
		},
		isAlertDialogActive: (id: Id) => activeAlertDialogs.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}