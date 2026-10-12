import { IModalContainerProps } from '../../core';

const defaultProps: IModalContainerProps = {
	defaultOptions: {
		scroll: 'paper',
		closeOnBackdropClick: true,
		closeOnEscape: true,
		fullWidth: false,
		maxWidth: 'sm',
		fullScreen: false,
		closeButton: true,
		header: true
	}
};

export default defaultProps;
