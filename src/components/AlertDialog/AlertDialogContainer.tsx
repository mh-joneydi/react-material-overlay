import { IAlertDialogContainerProps } from '../../core/AlertDialog/types';
import { useAlertDialogContainer } from '../../hooks';
import enhancedMerge from '../../utils/enhancedMerge';

import AlertDialog from './AlertDialog';

export const defaultProps: IAlertDialogContainerProps = {
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

export default function AlertDialogContainer(props: Partial<IAlertDialogContainerProps>) {
	const containerProps = enhancedMerge(defaultProps, props);

	const { isAlertDialogActive, alertDialogList } = useAlertDialogContainer(containerProps);

	return alertDialogList.map((props) => {
		return (
			<AlertDialog
				{...props}
				show={isAlertDialogActive(props.alertDialogId, props.containerId)}
				key={`alert-dialog-${props.containerId}-${props.alertDialogId}`}
			/>
		);
	});
}
