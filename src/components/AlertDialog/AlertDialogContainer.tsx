import { merge } from 'lodash';

import { useAlertDialogContainer } from '../../hooks/AlertDialog/useAlertDialogContainer';
import { IAlertDialogContainerProps } from '../../types';

import AlertDialog from './AlertDialog';

interface ModalContainerProps {
	reactSuspenseFallback?: React.ReactNode;
	defaultOptions: IAlertDialogContainerProps;
}

export const defaultProps: ModalContainerProps = {
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

export default function AlertDialogContainer(props: ModalContainerProps) {
	const { defaultOptions: options, reactSuspenseFallback } = merge({}, defaultProps, props);

	const { isAlertDialogActive, alertDialogList } = useAlertDialogContainer(options);

	return alertDialogList.map((props) => {
		return (
			<AlertDialog
				{...props}
				reactSuspenseFallback={reactSuspenseFallback}
				show={isAlertDialogActive(props.alertDialogId, props.containerId)}
				key={`alert-${props.containerId}-${props.alertDialogId}`}
			/>
		);
	});
}
