import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { RmoStack } from '../../core';
import { IAlertDialogProps } from '../../core/AlertDialog/types';
import { isFn } from '../../utils/propValidator';
import getPresetTransitionComponent from '../getPresetTransitionComponent';
import SuspenseFallback from '../SuspenseFallback';

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
	rmoStackId
}: IAlertDialogProps) => {
	const sequenceNumber = React.useRef(RmoStack.findIndexById(rmoStackId)).current;
	const PresetTransitionComponent = React.useMemo(
		() => (transitionPreset ? getPresetTransitionComponent(transitionPreset) : undefined),
		[transitionPreset]
	);

	function onClose(_?: unknown, reason?: string) {
		if (closeOnBackdropClick === false && reason && reason === 'backdropClick') {
			return;
		}

		closeAlertDialog();
	}

	const withCloseAlertDialog = (callBack: () => void) => async () => {
		await closeAlertDialog();
		callBack();
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
			<React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>
				{title && <DialogTitle {...(DialogTitleProps ?? {})}>{title}</DialogTitle>}
				{content && <DialogContent {...(DialogContentProps ?? {})}>{content}</DialogContent>}
				<DialogActions {...(DialogActionsProps ?? {})}>{Actions}</DialogActions>
			</React.Suspense>
		</Dialog>
	);
};

export default AlertDialog;
