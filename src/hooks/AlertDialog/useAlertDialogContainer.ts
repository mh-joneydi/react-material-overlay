import React from 'react';

import { isAlertDialogActive, registerAlertDialogContainer } from '../../core/AlertDialog/store';
import { IAlertDialogContainerProps } from '../../core/AlertDialog/types';

export default function useAlertDialogContainer(props: IAlertDialogContainerProps) {
	const { subscribe, getSnapshot, setDefaultOptions } = React.useRef(registerAlertDialogContainer(props)).current;
	setDefaultOptions(props.defaultOptions);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		alertDialogList: snapshot || [],
		isAlertDialogActive
	};
}
