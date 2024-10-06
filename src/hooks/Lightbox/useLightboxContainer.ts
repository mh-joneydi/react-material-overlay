import React from 'react';

import { isLightboxActive, registerLightboxContainer } from '../../core/Lightbox/store';
import { ILightboxContainerProps } from '../../types';

export function useLightboxContainer(props: ILightboxContainerProps) {
	const { subscribe, getSnapshot, setProps } = React.useRef(registerLightboxContainer(props)).current;
	setProps(props);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		lightboxList: snapshot || [],
		isLightboxActive
	};
}
