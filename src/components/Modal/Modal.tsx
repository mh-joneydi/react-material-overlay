/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React from 'react';
import { CardContent, Collapse, Dialog, Fade, Grow, Slide, Zoom } from '@mui/material';
import { merge } from 'lodash';

import { IModalProps } from '../../types';
import { isFn } from '../../utils/propValidator';
import CloseButton, { ICloseButtonProps } from '../CloseButton';

import ModalHeader, { HeaderProps } from './ModalHeader';

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
	defaultSx,
	classes,
	slots,
	transitionDuration,
	reactSuspenseFallback,
	closeButtonProps,
	header,
	subheader
}: IModalProps) => {
	const PresetTransitionComponent = React.useMemo(
		() => (transitionPreset ? getTransitionComponent(transitionPreset) : undefined),
		[transitionPreset]
	);

	function onClose(_?: unknown, reason?: string) {
		if (closeOnBackdropClick === false && reason && reason === 'backdropClick') {
			return;
		}

		closeModal();
	}

	const content = <React.Suspense fallback={reactSuspenseFallback}>{children}</React.Suspense>;

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

	const _headerProps: HeaderProps = {
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
			{...DialogProps}
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
			sx={(theme) => ({
				zIndex: theme.zIndex.modal + sequenceNumber,
				...merge(
					{},
					isFn(defaultSx) ? (defaultSx as Function)(theme) : defaultSx,
					isFn(sx) ? (sx as Function)(theme) : sx
				)
			})}
		>
			{raw ? (
				content
			) : (
				<React.Fragment>
					{Header}
					<CardContent
						{...contentWrapperProps}
						sx={(theme) => ({
							overflow: scroll === 'paper' ? 'auto' : undefined,
							...(isFn(contentWrapperProps?.sx) ? (contentWrapperProps.sx as Function)(theme) : contentWrapperProps?.sx)
						})}
					>
						{content}
					</CardContent>
				</React.Fragment>
			)}
		</Dialog>
	);
};

const getTransitionComponent = (transitionPreset: NonNullable<IModalProps['transitionPreset']>) =>
	React.forwardRef(function TransitionComponent(props: any, ref) {
		let PresetTransitionComponent;

		if (transitionPreset === 'slide') {
			PresetTransitionComponent = Slide;
		} else if (transitionPreset === 'fade') {
			PresetTransitionComponent = Fade;
		} else if (transitionPreset === 'grow') {
			PresetTransitionComponent = Grow;
		} else if (transitionPreset === 'collapse') {
			PresetTransitionComponent = Collapse;
		} else {
			PresetTransitionComponent = Zoom;
		}

		return (
			<PresetTransitionComponent
				{...props}
				ref={ref}
			/>
		);
	});

export default Modal;
