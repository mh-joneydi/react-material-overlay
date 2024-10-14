import React from 'react';

import { isLightboxActive, registerLightboxContainer } from '../../core/Lightbox/store';
import { ILightboxContainerProps } from '../../core/Lightbox/types';

export default function useLightboxContainer(props: ILightboxContainerProps) {
	const { subscribe, getSnapshot, setDefaultOptions } = React.useRef(registerLightboxContainer(props)).current;
	setDefaultOptions(props.defaultOptions);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		lightboxList: snapshot || [],
		isLightboxActive
	};
}
