import React from 'react';
import { Button, Dialog } from '@mui/material';

import { IAlertDialogLayoutProps, IAlertDialogProps } from '../../core/AlertDialog/types';
import { useRmoStackItemIndex } from '../../hooks';
import { isFn } from '../../utils/propValidator';
import CloseButton, { ICloseButtonProps } from '../CloseButton';
import CloseButtonIcon from '../CloseButtonIcon';
import getPresetTransitionComponent from '../getPresetTransitionComponent';
import SuspenseFallback from '../SuspenseFallback';

import AlertDialogLayout from './AlertDialogLayout';

const AlertDialog = ({
	title,
	content,
	closeAlertDialog,
	DialogActionsProps,
	DialogContentProps,
	DialogTitleProps,
	deleteAlertDialog,
	slotProps,
	show,
	fullScreen,
	maxWidth,
	scroll,
	fullWidth,
	transitionPreset,
	closeOnBackdropClick,
	closeOnEscape,
	PaperComponent,
	PaperProps,
	DialogProps,
	TransitionComponent,
	transitionProps,
	sx,
	classes,
	slots,
	transitionDuration,
	reactSuspenseFallback,
	onConfirmOk,
	onConfirmCancel,
	confirmCancelButtonProps,
	confirmOkButtonProps,
	confirmCancelText,
	confirmOkText,
	actionButtons,
	alertDialogId,
	closeButton,
	closeButtonProps,
	closeButtonIcon,
	layout
}: IAlertDialogProps) => {
	const sequenceNumber = useRmoStackItemIndex(alertDialogId);
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

		closeAlertDialog();
	}

	const withCloseAlertDialog = (callBack: () => void) => async () => {
		const closed = await closeAlertDialog();

		if (closed) {
			callBack();
		}
	};

	const defaultActionButtons = (
		<>
			<Button
				{...(confirmCancelButtonProps ?? {})}
				onClick={onConfirmCancel ? withCloseAlertDialog(onConfirmCancel) : closeAlertDialog}
			>
				{confirmCancelText}
			</Button>

			{onConfirmOk && (
				<Button
					{...(confirmOkButtonProps ?? {})}
					onClick={withCloseAlertDialog(onConfirmOk)}
				>
					{confirmOkText}
				</Button>
			)}
		</>
	);

	let Actions: React.ReactNode = defaultActionButtons;

	if (actionButtons) {
		const actionButtonsProps = {
			defaultButtons: defaultActionButtons,
			closeAlertDialog
		};

		if (isFn(actionButtons)) {
			Actions = actionButtons(actionButtonsProps);
		} else if (React.isValidElement(actionButtons)) {
			Actions = React.cloneElement(actionButtons, actionButtonsProps);
		}
	}

	const _closeButtonProps: ICloseButtonProps = {
		closeButtonProps,
		closeHandler: closeAlertDialog,
		icon: isFn(closeButtonIcon)
			? closeButtonIcon({ transitionPreset, transitionProps, fullScreen })
			: closeButtonIcon || <CloseButtonIcon />
	};

	let Close: React.ReactNode = null;

	if (closeButton === false) {
		// hide
	} else if (isFn(closeButton)) {
		Close = closeButton(_closeButtonProps);
	} else if (React.isValidElement(closeButton)) {
		Close = React.cloneElement(closeButton, closeButtonProps);
	} else if (closeButton) {
		Close = CloseButton(_closeButtonProps);
	}

	const _layoutProps: IAlertDialogLayoutProps = {
		title,
		content,
		actions: Actions,
		closeButton: Close,
		closeAlertDialog,
		DialogTitleProps,
		DialogContentProps,
		DialogActionsProps
	};

	let Layout: React.ReactNode;

	if (isFn(layout)) {
		Layout = layout(_layoutProps);
	} else if (React.isValidElement(layout)) {
		Layout = React.cloneElement(layout, _layoutProps);
	} else {
		Layout = AlertDialogLayout(_layoutProps);
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
			onTransitionExited={deleteAlertDialog}
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
			<React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>{Layout}</React.Suspense>
		</Dialog>
	);
};

export default AlertDialog;
