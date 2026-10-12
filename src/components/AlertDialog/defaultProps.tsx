import { IAlertDialogContainerProps } from '../../core';

const defaultProps: IAlertDialogContainerProps = {
	defaultOptions: {
		scroll: 'paper',
		closeOnBackdropClick: true,
		closeOnEscape: true,
		fullWidth: false,
		maxWidth: 'sm',
		fullScreen: false,
		confirmCancelText: 'cancel',
		confirmOkText: 'ok',
		closeButton: false
	}
};

export default defaultProps;
