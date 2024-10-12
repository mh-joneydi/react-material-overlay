import React from 'react';

import { isModalActive, registerModalContainer } from '../../core/Modal/store';
import { IModalContainerProps } from '../../core/Modal/types';

export function useModalContainer(props: IModalContainerProps) {
	const { subscribe, getSnapshot, setProps } = React.useRef(registerModalContainer(props)).current;
	setProps(props);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		modalList: snapshot || [],
		isModalActive
	};
}
