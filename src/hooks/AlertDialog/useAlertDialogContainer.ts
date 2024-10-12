import React from 'react';

import { isAlertDialogActive, registerAlertDialogContainer } from '../../core/AlertDialog/store';
import { IAlertDialogContainerProps } from '../../core/AlertDialog/types';

export function useAlertDialogContainer(props: IAlertDialogContainerProps) {
	const { subscribe, getSnapshot, setProps } = React.useRef(registerAlertDialogContainer(props)).current;
	setProps(props);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		alertDialogList: snapshot || [],
		isAlertDialogActive
	};
}
