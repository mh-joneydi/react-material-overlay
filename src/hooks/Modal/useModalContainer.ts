import React from 'react';

import { isModalActive, registerModalContainer } from '../../core/Modal/store';
import { IModalContainerProps } from '../../core/Modal/types';

export default function useModalContainer(props: IModalContainerProps) {
	const { subscribe, getSnapshot, setDefaultOptions } = React.useRef(registerModalContainer(props)).current;
	setDefaultOptions(props.defaultOptions);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		modalList: snapshot || [],
		isModalActive
	};
}
