import React from 'react';

import { isBottomSheetActive, registerBottomSheetContainer } from '../../core/BottomSheet/store';
import { IBottomSheetContainerProps } from '../../core/BottomSheet/types';

export default function useBottomSheetContainer(props: IBottomSheetContainerProps) {
	const { subscribe, getSnapshot, setDefaultOptions } = React.useRef(registerBottomSheetContainer(props)).current;
	setDefaultOptions(props.defaultOptions);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		bottomSheetList: snapshot || [],
		isBottomSheetActive
	};
}
