import React from 'react';
import { merge } from 'lodash';

import type { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import enhancedMerge from '../../utils/enhancedMerge';
import mergeClasses from '../../utils/mergeClasses';
import { canBeRendered, isFn, isStr } from '../../utils/propValidator';
import { popRMOStackState } from '../RMO';

import { IModal, IModalContainerProps, IModalProps, INotValidatedModalProps, ModalContent } from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

interface IActiveModal {
	content: React.ReactNode;
	props: IModalProps;
}

export function createContainerObserver(id: Id, containerProps: IModalContainerProps) {
	let modalCount = 0;
	let activeModals: Id[] = [];
	let snapshot: IModal[] = [];
	let props = containerProps;

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

	const shouldIgnoreModal = ({ containerId, modalId }: INotValidatedModalProps) => {
		const containerMismatch = containerId ? containerId !== id : id !== Default.CONTAINER_ID;
		const isDuplicate = modals.has(modalId);

		return containerMismatch || isDuplicate;
	};

	const popModal = () => {
		activeModals = activeModals.slice(0, -1);
		notify();
	};

	const pushModal = async (modal: IActiveModal) => {
		const { modalId, onOpen } = modal.props;

		modals.set(modalId, modal);
		activeModals = [...activeModals, modalId];

		notify();

		if (isFn(onOpen)) {
			onOpen();
		}
	};

	const buildModal = (content: ModalContent, options: INotValidatedModalProps): boolean => {
		if (shouldIgnoreModal(options)) {
			return false;
		}

		const { modalId } = options;

		const closeModal = async () => {
			popModal();
			await popRMOStackState({ type: 'modal', containerId: id, modalId });
		};

		modalCount++;

		const {
			sx: defaultSx,
			classes: defaultClasses,
			closeButton: defaultCloseButton,
			header: defaultHeader,
			closeButtonIcon: defaultCloseButtonIcon,
			...containerProps
		} = props;

		const { classes, closeButton, header, closeButtonIcon, sx, ...modalOptions } = options;

		const modalProps = {
			...enhancedMerge(containerProps, Object.fromEntries(Object.entries(modalOptions).filter(([, v]) => v != null))),
			modalId,
			containerId: id,
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

		const activeModal: IActiveModal = {
			content: modalContent as React.ReactNode,
			props: modalProps
		};

		pushModal(activeModal);

		return true;
	};

	return {
		id,
		props,
		observe,
		popModal,
		get modalCount() {
			return modalCount;
		},
		buildModal,
		setProps(p: IModalContainerProps) {
			props = p;
		},
		isModalActive: (id: Id) => activeModals.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
