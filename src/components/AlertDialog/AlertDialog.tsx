/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { merge } from 'lodash';

import { IAlertDialogProps } from '../../types';
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
	sequenceNumber,
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
	defaultSx,
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
	actionButtons
}: IAlertDialogProps) => {
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

	const withCloseAlertDialog = (callBack: () => void) => () => {
		callBack();
		closeAlertDialog();
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
				zIndex: theme.zIndex.modal + sequenceNumber,
				...merge(
					{},
					isFn(defaultSx) ? (defaultSx as Function)(theme) : defaultSx,
					isFn(sx) ? (sx as Function)(theme) : sx
				)
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
