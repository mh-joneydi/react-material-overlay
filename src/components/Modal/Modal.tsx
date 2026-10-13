import React from 'react';
import { Dialog } from '@mui/material';

import { IModalContentWrapperProps, IModalHeaderProps, IModalProps } from '../../core/Modal/types';
import { useRmoStackItemIndex } from '../../hooks';
import { isFn } from '../../utils/propValidator';
import CloseButton, { ICloseButtonProps } from '../CloseButton';
import CloseButtonIcon from '../CloseButtonIcon';
import getPresetTransitionComponent from '../getPresetTransitionComponent';
import SuspenseFallback from '../SuspenseFallback';

import ModalContentWrapper from './ModalContentWrapper';
import ModalHeader from './ModalHeader';

const Modal = (props: IModalProps) => {
	const {
		children,
		show,
		deleteModal,
		closeModal,
		raw,
		fullScreen,
		maxWidth,
		scroll,
		fullWidth,
		closeButton,
		transitionPreset,
		closeOnBackdropClick,
		closeOnEscape,
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
		slotProps,
		modalId,
		contentWrapper
	} = props;
	const sequenceNumber = useRmoStackItemIndex(modalId);
	const PresetTransitionComponent = React.useMemo(
		() => (transitionPreset ? getPresetTransitionComponent(transitionPreset) : undefined),
		[transitionPreset]
	);

	function onClose(_?: unknown, reason?: string) {
		if (closeOnBackdropClick === false && reason && reason === 'backdropClick') {
			return;
		}

		if (closeOnEscape === false && reason && reason === 'escapeKeyDown') {
			return;
		}

		closeModal();
	}

	const content = <React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>{children}</React.Suspense>;

	const _closeButtonProps: ICloseButtonProps = {
		closeButtonProps,
		closeHandler: closeModal,
		icon: isFn(closeButtonIcon) ? closeButtonIcon(props) : closeButtonIcon || <CloseButtonIcon />
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
		...props,
		closeButton: Close
	};

	let Header: React.ReactNode = null;

	if (header === false) {
		// hide
	} else if (isFn(header)) {
		Header = header(_headerProps);
	} else if (React.isValidElement(header)) {
		const headerElementProps = { ..._headerProps };
		delete headerElementProps.children;
		Header = React.cloneElement(header, headerElementProps);
	} else {
		Header = ModalHeader(_headerProps);
	}

	const _contentWrapperProps: IModalContentWrapperProps = {
		...props,
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
