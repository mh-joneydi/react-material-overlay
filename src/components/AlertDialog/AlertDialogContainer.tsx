import { IAlertDialogContainerProps } from '../../core/AlertDialog/types';
import { useAlertDialogContainer } from '../../hooks/AlertDialog/useAlertDialogContainer';
import enhancedMerge from '../../utils/enhancedMerge';

import AlertDialog from './AlertDialog';

interface AlertDialogContainerProps {
	reactSuspenseFallback?: React.ReactNode;
	defaultOptions?: IAlertDialogContainerProps;
}

export const defaultProps: AlertDialogContainerProps = {
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

export default function AlertDialogContainer(props: AlertDialogContainerProps) {
	const { defaultOptions, reactSuspenseFallback } = enhancedMerge(defaultProps, props);

	const { isAlertDialogActive, alertDialogList } = useAlertDialogContainer(defaultOptions!);

	return alertDialogList.map((props) => {
		return (
			<AlertDialog
				{...props}
				reactSuspenseFallback={reactSuspenseFallback}
				show={isAlertDialogActive(props.alertDialogId, props.containerId)}
				key={`alert-dialog-${props.containerId}-${props.alertDialogId}`}
			/>
		);
	});
}
