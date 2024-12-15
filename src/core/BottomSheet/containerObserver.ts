import React from 'react';
import clsx from 'clsx';
import { merge } from 'lodash';

import type { Id, Notify } from '../../types';
import enhancedMerge from '../../utils/enhancedMerge';
import { canBeRendered, isFn, isStr } from '../../utils/propValidator';
import RmoStack from '../RmoStack';

import {
	BottomSheetContent,
	BottomSheetContentProps,
	IBottomSheet,
	IBottomSheetCustomRenderProps,
	IBottomSheetDefaultOptions,
	IBottomSheetProps,
	INotValidatedBottomSheetProps
} from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(id: Id, containerDefaultOptions: IBottomSheetDefaultOptions) {
	let bottomSheetCount = 0;
	let activeBottomSheets: Id[] = [];
	let snapshot: IBottomSheet[] = [];
	let defaultOptions = containerDefaultOptions;

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

	function shouldIgnorePop(bottomSheetId: Id) {
		const lastActiveId = activeBottomSheets.at(-1);
		return lastActiveId !== bottomSheetId;
	}

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

	const buildBottomSheet = (content: BottomSheetContent, options: INotValidatedBottomSheetProps) => {
		if (bottomSheets.has(options.bottomSheetId)) {
			throw new Error('bottom sheet is duplicated!');
		}

		const { bottomSheetId } = options;

		const closeBottomSheet = async () => {
			if (shouldIgnorePop(bottomSheetId)) {
				return;
			}

			popBottomSheet();
			await RmoStack.pop({ id: bottomSheetId, preventEventTriggering: true });
		};

		bottomSheetCount++;

		const {
			sx: defaultSx,
			className: defaultClassName,
			footer: defaultFooter,
			header: defaultHeader,
			sibling: defaultSibling,
			closeButton: defaultCloseButton,
			...containerProps
		} = defaultOptions;

		const { sx, className, footer, sibling, header, closeButton, ...bottomSheetOptions } = options;

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

		if (defaultSx && sx) {
			bottomSheetProps.sx = (theme) =>
				merge(
					{},
					isFn(defaultSx) ? (defaultSx as Function)(theme) : (defaultSx ?? {}),
					isFn(sx) ? (sx as Function)(theme) : (sx ?? {})
				);
		} else {
			bottomSheetProps.sx = sx || defaultSx;
		}

		if (isFn(className)) {
			bottomSheetProps.className = className(defaultClassName);
		} else if (defaultClassName && className) {
			bottomSheetProps.className = clsx(defaultClassName, className);
		} else if (defaultClassName) {
			bottomSheetProps.className = defaultClassName;
		} else {
			bottomSheetProps.className = className;
		}

		const commonRenderProps: IBottomSheetCustomRenderProps = { closeBottomSheet, bottomSheetProps };

		bottomSheetProps.closeButton = defaultCloseButton;

		if (closeButton === false || canBeRendered(closeButton)) {
			bottomSheetProps.closeButton = closeButton;
		} else if (closeButton === true) {
			bottomSheetProps.closeButton = canBeRendered(defaultCloseButton) ? defaultCloseButton : true;
		}

		bottomSheetProps.header = defaultHeader;

		if (header === false || canBeRendered(header)) {
			bottomSheetProps.header = header;
		} else if (header === true) {
			bottomSheetProps.header = canBeRendered(defaultHeader) ? defaultHeader : true;
		}

		let _footer = defaultFooter;

		if (footer === false || canBeRendered(footer)) {
			_footer = footer;
		}

		if (_footer) {
			if (isFn(_footer)) {
				bottomSheetProps.footer = _footer(commonRenderProps);
			} else if (React.isValidElement(_footer)) {
				bottomSheetProps.footer = React.cloneElement(_footer, commonRenderProps);
			}
		}

		let _sibling = defaultSibling;

		if (sibling === false || canBeRendered(sibling)) {
			_sibling = sibling;
		}

		if (_sibling) {
			if (isFn(_sibling)) {
				bottomSheetProps.sibling = _sibling(commonRenderProps);
			} else if (React.isValidElement(_sibling)) {
				bottomSheetProps.sibling = React.cloneElement(_sibling, commonRenderProps);
			}
		}

		let bottomSheetContent = content;

		if (React.isValidElement(content) && !isStr(content.type)) {
			bottomSheetContent = React.cloneElement(
				content as React.ReactElement<BottomSheetContentProps>,
				commonRenderProps
			);
		} else if (isFn(content)) {
			bottomSheetContent = content(commonRenderProps);
		}

		const activeBottomSheet: IBottomSheet = {
			content: bottomSheetContent as React.ReactNode,
			props: bottomSheetProps
		};

		return activeBottomSheet;
	};

	return {
		id,
		defaultOptions,
		observe,
		popBottomSheet,
		pushBottomSheet,
		get bottomSheetCount() {
			return bottomSheetCount;
		},
		buildBottomSheet,
		setDefaultOptions(d: IBottomSheetDefaultOptions) {
			defaultOptions = d;
		},
		isBottomSheetActive: (id: Id) => activeBottomSheets.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
