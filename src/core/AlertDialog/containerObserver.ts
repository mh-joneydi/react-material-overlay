import { merge } from 'lodash';

import type { Id, Notify } from '../../types';
import enhancedMerge from '../../utils/enhancedMerge';
import mergeClasses from '../../utils/mergeClasses';
import { isFn } from '../../utils/propValidator';
import RmoStack from '../RmoStack';

import { IAlertDialogDefaultOptions, IAlertDialogProps, INotValidatedAlertDialogProps } from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(id: Id, containerDefaultOptions: IAlertDialogDefaultOptions) {
	let alertDialogCount = 0;
	let activeAlertDialogs: Id[] = [];
	let snapshot: IAlertDialogProps[] = [];
	let defaultOptions = containerDefaultOptions;

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

	function shouldIgnorePop(alertDialogId: Id) {
		const lastActiveAlertDialogId = activeAlertDialogs.at(-1);

		return lastActiveAlertDialogId !== alertDialogId;
	}

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

	const buildAlertDialog = (options: INotValidatedAlertDialogProps) => {
		if (alertDialogs.has(options.alertDialogId)) {
			throw new Error('alert dialog is duplicated!');
		}

		const { alertDialogId, rmoStackId } = options;

		const closeAlertDialog = async () => {
			if (shouldIgnorePop(alertDialogId)) {
				return;
			}

			popAlertDialog();
			await RmoStack.pop({ id: rmoStackId, preventEventTriggering: true });
		};

		alertDialogCount++;

		const { sx: defaultSx, classes: defaultClasses, ...containerProps } = defaultOptions;

		const { classes, sx, ...alertDialogOptions } = options;

		const alertDialogProps = {
			...enhancedMerge(
				containerProps,
				Object.fromEntries(Object.entries(alertDialogOptions).filter(([, v]) => v != null))
			),
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

		if (defaultSx && sx) {
			alertDialogProps.sx = (theme) =>
				merge(
					{},
					isFn(defaultSx) ? (defaultSx as Function)(theme) : (defaultSx ?? {}),
					isFn(sx) ? (sx as Function)(theme) : (sx ?? {})
				);
		} else {
			alertDialogProps.sx = sx || defaultSx;
		}

		if (isFn(classes)) {
			alertDialogProps.classes = classes(defaultClasses);
		} else if (defaultClasses && classes) {
			alertDialogProps.classes = mergeClasses(defaultClasses, classes);
		} else if (defaultClasses) {
			alertDialogProps.classes = defaultClasses;
		} else {
			alertDialogProps.classes = classes;
		}

		return alertDialogProps;
	};

	return {
		id,
		defaultOptions,
		observe,
		pushAlertDialog,
		popAlertDialog,
		get alertDialogCount() {
			return alertDialogCount;
		},
		buildAlertDialog,
		setDefaultOptions(d: IAlertDialogDefaultOptions) {
			defaultOptions = d;
		},
		isAlertDialogActive: (id: Id) => activeAlertDialogs.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
