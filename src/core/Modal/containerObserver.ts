import React from 'react';
import { merge } from 'lodash';

import type { Id, Notify } from '../../types';
import enhancedMerge from '../../utils/enhancedMerge';
import mergeClasses from '../../utils/mergeClasses';
import { canBeRendered, isFn, isStr } from '../../utils/propValidator';
import RmoStack from '../RmoStack';

import { IModal, IModalDefaultOptions, IModalProps, INotValidatedModalProps, ModalContent } from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(containerId: Id, containerDefaultOptions: IModalDefaultOptions) {
	let modalCount = 0;
	let activeModals: Id[] = [];
	let snapshot: IModal[] = [];
	let defaultOptions = containerDefaultOptions;

	const modals = new Map<Id, IModal>();
	const listeners = new Set<Notify>();

	const observe = (notify: Notify) => {
		listeners.add(notify);
		return () => listeners.delete(notify);
	};

	const notify = () => {
		snapshot = Array.from(modals.values());
		listeners.forEach((cb) => cb());
	};

	function shouldIgnorePop(modalId: Id) {
		const lastActiveId = activeModals.at(-1);
		return lastActiveId !== modalId;
	}

	const popModal = () => {
		activeModals = activeModals.slice(0, -1);
		notify();
	};

	const pushModal = (modal: IModal) => {
		const { modalId, onOpen } = modal.props;

		modals.set(modalId, modal);
		activeModals = [...activeModals, modalId];

		notify();

		if (isFn(onOpen)) {
			onOpen();
		}
	};

	const buildModal = (content: ModalContent, options: INotValidatedModalProps) => {
		if (modals.has(options.modalId)) {
			throw new Error('modal is duplicated!');
		}

		const { modalId } = options;

		const closeModal = async () => {
			if (shouldIgnorePop(modalId)) {
				return;
			}

			popModal();
			await RmoStack.pop({ id: modalId, preventEventTriggering: true });
		};

		modalCount++;

		const {
			sx: defaultSx,
			classes: defaultClasses,
			closeButton: defaultCloseButton,
			header: defaultHeader,
			closeButtonIcon: defaultCloseButtonIcon,
			..._defaultOptions
		} = defaultOptions;

		const { classes, closeButton, header, closeButtonIcon, sx, ...modalOptions } = options;

		const modalProps = {
			...enhancedMerge(_defaultOptions, Object.fromEntries(Object.entries(modalOptions).filter(([, v]) => v != null))),
			modalId,
			containerId,
			closeModal,
			deleteModal() {
				const modalToRemove = modals.get(modalId)!;
				const { onClose } = modalToRemove.props;

				if (isFn(onClose)) {
					onClose();
				}

				modals.delete(modalId);

				modalCount--;

				if (modalCount < 0) {
					modalCount = 0;
				}

				notify();
			}
		} as IModalProps;

		if (defaultSx && sx) {
			modalProps.sx = (theme) =>
				merge(
					{},
					isFn(defaultSx) ? (defaultSx as Function)(theme) : (defaultSx ?? {}),
					isFn(sx) ? (sx as Function)(theme) : (sx ?? {})
				);
		} else {
			modalProps.sx = sx || defaultSx;
		}

		if (isFn(classes)) {
			modalProps.classes = classes(defaultClasses);
		} else if (defaultClasses && classes) {
			modalProps.classes = mergeClasses(defaultClasses, classes);
		} else if (defaultClasses) {
			modalProps.classes = defaultClasses;
		} else {
			modalProps.classes = classes;
		}

		modalProps.closeButton = defaultCloseButton;

		if (closeButton === false || canBeRendered(closeButton)) {
			modalProps.closeButton = closeButton;
		} else if (closeButton === true) {
			modalProps.closeButton = canBeRendered(defaultCloseButton) ? defaultCloseButton : true;
		}

		modalProps.closeButtonIcon = closeButtonIcon || defaultCloseButtonIcon;

		modalProps.header = defaultHeader;

		if (header === false || canBeRendered(header)) {
			modalProps.header = header;
		} else if (header === true) {
			modalProps.header = canBeRendered(defaultHeader) ? defaultHeader : true;
		}

		let modalContent = content;

		if (React.isValidElement(content) && !isStr(content.type)) {
			modalContent = React.cloneElement(content as React.ReactElement, {
				closeModal,
				modalProps
			});
		} else if (isFn(content)) {
			modalContent = content({ closeModal, modalProps });
		}

		const activeModal: IModal = {
			content: modalContent as React.ReactNode,
			props: modalProps
		};

		return activeModal;
	};

	return {
		id: containerId,
		defaultOptions,
		observe,
		popModal,
		pushModal,
		get modalCount() {
			return modalCount;
		},
		buildModal,
		setDefaultOptions(d: IModalDefaultOptions) {
			defaultOptions = d;
		},
		isModalActive: (id: Id) => activeModals.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
