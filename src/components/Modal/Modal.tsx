import React from 'react';
import { CardContent, Dialog } from '@mui/material';

import { IModalProps } from '../../core/Modal/types';
import { isFn } from '../../utils/propValidator';
import getPresetTransitionComponent from '../getPresetTransitionComponent';
import SuspenseFallback from '../SuspenseFallback';

import ModalCloseButton, { IModalCloseButtonProps } from './ModalCloseButton';
import ModalHeader, { ModalHeaderProps } from './ModalHeader';

const Modal = ({
	children,
	show,
	deleteModal,
	closeModal,
	title,
	sequenceNumber,
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
	slotProps
}: IModalProps) => {
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

	const _closeButtonProps: IModalCloseButtonProps = {
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
		Close = ModalCloseButton(_closeButtonProps);
	}

	const _headerProps: ModalHeaderProps = {
		closeButton: Close,
		headerProps,
		fullScreen,
		maxWidth,
		scroll,
		subheader,
		title,
		transitionPreset,
		transitionProps,
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
				zIndex: theme.zIndex.modal + sequenceNumber,
				...(isFn(sx) ? (sx as Function)(theme) : (sx ?? {}))
			})}
		>
			{raw ? (
				content
			) : (
				<React.Fragment>
					{Header}
					<CardContent
						{...(contentWrapperProps ?? {})}
						sx={(theme) => ({
							overflow: scroll === 'paper' ? 'auto' : undefined,
							...(isFn(contentWrapperProps?.sx)
								? (contentWrapperProps.sx as Function)(theme)
								: (contentWrapperProps?.sx ?? {}))
						})}
					>
						{content}
					</CardContent>
				</React.Fragment>
			)}
		</Dialog>
	);
};

export default Modal;
