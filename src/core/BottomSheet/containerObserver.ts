import React from 'react';
import clsx from 'clsx';

import type { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import enhancedMerge from '../../utils/enhancedMerge';
import { canBeRendered, isFn, isStr } from '../../utils/propValidator';
import { popRMOStackState } from '../RMO';

import {
	BottomSheetContent,
	BottomSheetContentProps,
	IBottomSheet,
	IBottomSheetContainerProps,
	IBottomSheetCustomRenderProps,
	IBottomSheetProps,
	INotValidatedBottomSheetProps
} from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(id: Id, containerProps: IBottomSheetContainerProps) {
	let bottomSheetCount = 0;
	let activeBottomSheets: Id[] = [];
	let snapshot: IBottomSheet[] = [];
	let props = containerProps;

	const bottomSheets = new Map<Id, IBottomSheet>();
	const listeners = new Set<Notify>();

	const observe = (notify: Notify) => {
		listeners.add(notify);
		return () => listeners.delete(notify);
	};

	const notify = () => {
		snapshot = Array.from(bottomSheets.values());
		listeners.forEach((cb) => cb());
	};

	const shouldIgnoreBottomSheet = ({ containerId, bottomSheetId }: INotValidatedBottomSheetProps) => {
		const containerMismatch = containerId ? containerId !== id : id !== Default.CONTAINER_ID;
		const isDuplicate = bottomSheets.has(bottomSheetId);

		return containerMismatch || isDuplicate;
	};

	const popBottomSheet = () => {
		activeBottomSheets = activeBottomSheets.slice(0, -1);
		notify();
	};

	const pushBottomSheet = async (bottomSheet: IBottomSheet) => {
		const { bottomSheetId, onOpen } = bottomSheet.props;

		bottomSheets.set(bottomSheetId, bottomSheet);
		activeBottomSheets = [...activeBottomSheets, bottomSheetId];

		notify();

		if (isFn(onOpen)) {
			onOpen();
		}
	};

	const buildBottomSheet = (content: BottomSheetContent, options: INotValidatedBottomSheetProps): boolean => {
		if (shouldIgnoreBottomSheet(options)) {
			return false;
		}

		const { bottomSheetId } = options;

		const closeBottomSheet = async () => {
			popBottomSheet();
			await popRMOStackState({ type: 'bottomSheet', containerId: id, bottomSheetId });
		};

		bottomSheetCount++;

		const { className: defaultClassName, footer: defaultFooter, sibling: defaultSibling, ...containerProps } = props;

		const { className, footer, sibling, ...bottomSheetOptions } = options;

		const bottomSheetProps = {
			...enhancedMerge(
				containerProps,
				Object.fromEntries(Object.entries(bottomSheetOptions).filter(([, v]) => v != null))
			),
			bottomSheetId,
			containerId: id,
			closeBottomSheet,
			deleteBottomSheet() {
				const bottomSheetToRemove = bottomSheets.get(bottomSheetId)!;
				const { onClose } = bottomSheetToRemove.props;

				if (isFn(onClose)) {
					onClose();
				}

				bottomSheets.delete(bottomSheetId);

				bottomSheetCount--;

				if (bottomSheetCount < 0) {
					bottomSheetCount = 0;
				}

				notify();
			}
		} as IBottomSheetProps;

		if (isFn(className)) {
			bottomSheetProps.className = className(defaultClassName);
		} else if (defaultClassName && className) {
			bottomSheetProps.className = clsx(defaultClassName, className);
		} else if (defaultClassName) {
			bottomSheetProps.className = defaultClassName;
		} else {
			bottomSheetProps.className = className;
		}

		const renderProps: IBottomSheetCustomRenderProps = { closeBottomSheet, bottomSheetProps };

		let _footer = defaultFooter;

		if (footer === false || canBeRendered(footer)) {
			_footer = footer;
		}

		if (_footer) {
			if (isFn(_footer)) {
				bottomSheetProps.footer = _footer(renderProps);
			} else if (React.isValidElement(_footer)) {
				bottomSheetProps.footer = React.cloneElement(_footer, renderProps);
			}
		}

		let _sibling = defaultSibling;

		if (sibling === false || canBeRendered(sibling)) {
			_sibling = sibling;
		}

		if (_sibling) {
			if (isFn(_sibling)) {
				bottomSheetProps.sibling = _sibling(renderProps);
			} else if (React.isValidElement(_sibling)) {
				bottomSheetProps.sibling = React.cloneElement(_sibling, renderProps);
			}
		}

		let bottomSheetContent = content;

		if (React.isValidElement(content) && !isStr(content.type)) {
			bottomSheetContent = React.cloneElement(content as React.ReactElement<BottomSheetContentProps>, renderProps);
		} else if (isFn(content)) {
			bottomSheetContent = content(renderProps);
		}

		const activeBottomSheet: IBottomSheet = {
			content: bottomSheetContent as React.ReactNode,
			props: bottomSheetProps
		};

		pushBottomSheet(activeBottomSheet);

		return true;
	};

	return {
		id,
		props,
		observe,
		popBottomSheet,
		get bottomSheetCount() {
			return bottomSheetCount;
		},
		buildBottomSheet,
		setProps(p: IBottomSheetContainerProps) {
			props = p;
		},
		isBottomSheetActive: (id: Id) => activeBottomSheets.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
