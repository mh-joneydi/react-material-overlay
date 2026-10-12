import { DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { IAlertDialogLayoutProps } from '../../core/AlertDialog/types';

export default function AlertDialogLayout({
	title,
	content,
	actions,
	closeButton,
	DialogTitleProps,
	DialogContentProps,
	DialogActionsProps
}: IAlertDialogLayoutProps) {
	return (
		<>
			{title && <DialogTitle {...(DialogTitleProps ?? {})}>{title}</DialogTitle>}
			{content && <DialogContent {...(DialogContentProps ?? {})}>{content}</DialogContent>}
			<DialogActions {...(DialogActionsProps ?? {})}>{actions}</DialogActions>
			{closeButton}
		</>
	);
}
