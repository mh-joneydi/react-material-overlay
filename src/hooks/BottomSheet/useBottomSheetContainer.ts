import React from 'react';

import { isBottomSheetActive, registerBottomSheetContainer } from '../../core/BottomSheet/store';
import { IBottomSheetContainerProps } from '../../core/BottomSheet/types';

export function useBottomSheetContainer(props: IBottomSheetContainerProps) {
	const { subscribe, getSnapshot, setProps } = React.useRef(registerBottomSheetContainer(props)).current;
	setProps(props);

	const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		bottomSheetList: snapshot || [],
		isBottomSheetActive
	};
}
