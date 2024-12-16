import React from 'react';
import { Dialog } from '@mui/material';

import { IModalContentWrapperProps, IModalHeaderProps, IModalProps } from '../../core/Modal/types';
import { useRmoStackItemIndex } from '../../hooks';
import { isFn } from '../../utils/propValidator';
import CloseButton, { ICloseButtonProps } from '../CloseButton';
import getPresetTransitionComponent from '../getPresetTransitionComponent';
import SuspenseFallback from '../SuspenseFallback';

import ModalContentWrapper from './ModalContentWrapper';
import ModalHeader from './ModalHeader';

const Modal = ({
	children,
	show,
	deleteModal,
	closeModal,
	title,
	raw,
	fullScreen,
	maxWidth,
	scroll,
	fullWidth,
	closeButton,
	headerProps,
	contentWrapperProps,
	transitionPreset,
	closeOnBackdropClick,
	PaperComponent,
	PaperProps,
	DialogProps,
	TransitionComponent,
	transitionProps,
	closeButtonIcon,
	sx,
	classes,
	slots,
	transitionDuration,
	reactSuspenseFallback,
	closeButtonProps,
	header,
	subheader,
	slotProps,
	modalId,
	contentWrapper,
	containerId
}: IModalProps) => {
	const sequenceNumber = useRmoStackItemIndex(modalId);
	const PresetTransitionComponent = React.useMemo(
		() => (transitionPreset ? getPresetTransitionComponent(transitionPreset) : undefined),
		[transitionPreset]
	);

	function onClose(_?: unknown, reason?: string) {
		if (closeOnBackdropClick === false && reason && reason === 'backdropClick') {
			return;
		}

		closeModal();
	}

	const content = <React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>{children}</React.Suspense>;

	const _closeButtonProps: ICloseButtonProps = {
		closeButtonProps,
		closeHandler: closeModal,
		icon: isFn(closeButtonIcon) ? closeButtonIcon({ transitionPreset, transitionProps, fullScreen }) : closeButtonIcon
	};

	let Close: React.ReactNode = null;

	if (closeButton === false) {
		// hide
	} else if (isFn(closeButton)) {
		Close = closeButton(_closeButtonProps);
	} else if (React.isValidElement(closeButton)) {
		Close = React.cloneElement(closeButton, closeButtonProps);
	} else {
		Close = CloseButton(_closeButtonProps);
	}

	const _headerProps: IModalHeaderProps = {
		closeButton: Close,
		headerProps,
		fullScreen,
		maxWidth,
		scroll,
		subheader,
		title,
		transitionPreset,
		transitionProps,
		containerId,
		modalId,
		closeModal
	};

	let Header: React.ReactNode = null;

	if (header === false) {
		// hide
	} else if (isFn(header)) {
		Header = header(_headerProps);
	} else if (React.isValidElement(header)) {
		Header = React.cloneElement(header, _headerProps);
	} else {
		Header = ModalHeader(_headerProps);
	}

	const _contentWrapperProps: IModalContentWrapperProps = {
		fullScreen,
		maxWidth,
		scroll,
		contentWrapperProps,
		modalId,
		containerId,
		fullWidth,
		transitionPreset,
		transitionProps,
		closeModal,
		children: content
	};

	let WrappedContent: React.ReactNode;

	if (contentWrapper === false) {
		WrappedContent = content;
	} else if (isFn(contentWrapper)) {
		WrappedContent = contentWrapper(_contentWrapperProps);
	} else if (React.isValidElement(contentWrapper)) {
		WrappedContent = React.cloneElement(contentWrapper, _contentWrapperProps);
	} else {
		WrappedContent = ModalContentWrapper(_contentWrapperProps);
	}

	return (
		<Dialog
			{...(DialogProps ?? {})}
			PaperComponent={PaperComponent}
			transitionDuration={transitionDuration}
			PaperProps={PaperProps}
			TransitionComponent={TransitionComponent || PresetTransitionComponent}
			TransitionProps={transitionProps}
			fullWidth={fullWidth}
			fullScreen={fullScreen}
			maxWidth={maxWidth}
			scroll={scroll}
			onTransitionExited={deleteModal}
			open={show}
			onClose={onClose}
			classes={classes}
			slots={slots}
			slotProps={slotProps}
			sx={(theme) => ({
				...(isFn(sx) ? (sx as Function)(theme) : (sx ?? {})),
				zIndex: theme.zIndex.modal + sequenceNumber
			})}
		>
			{raw ? (
				content
			) : (
				<React.Fragment>
					{Header} {WrappedContent}
				</React.Fragment>
			)}
		</Dialog>
	);
};

export default Modal;
