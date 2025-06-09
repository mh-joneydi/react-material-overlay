import { IAlertDialogContainerProps } from '../../core';

const defaultProps: IAlertDialogContainerProps = {
	defaultOptions: {
		scroll: 'paper',
		closeOnBackdropClick: true,
		fullWidth: false,
		maxWidth: 'sm',
		fullScreen: false,
		confirmCancelText: 'cancel',
		confirmOkText: 'ok'
	}
};

export default defaultProps;
