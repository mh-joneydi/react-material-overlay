import React from 'react';
import rsbsStyles from 'react-spring-bottom-sheet/dist/style.css';
import createCache from '@emotion/cache';
import { CacheProvider, css, Global } from '@emotion/react';
import { GlobalStyles } from '@mui/material';

import { IBottomSheetContainerProps } from '../../core/BottomSheet/types';
import { useBottomSheetContainer } from '../../hooks/BottomSheet/useBottomSheetContainer';
import enhancedMerge from '../../utils/enhancedMerge';

import BottomSheet from './BottomSheet';

interface BottomSheetContainer {
	reactSuspenseFallback?: React.ReactNode;
	defaultOptions?: IBottomSheetContainerProps;
}

export const defaultProps: BottomSheetContainer = {
	defaultOptions: {
		initialFocusRef: false
	}
};

const rsbsStylesCache = createCache({ key: 'rsbs', prepend: true });

export default function ModalContainer(props: BottomSheetContainer) {
	const { defaultOptions, reactSuspenseFallback } = enhancedMerge(defaultProps, props);

	const { isBottomSheetActive, bottomSheetList } = useBottomSheetContainer(defaultOptions!);

	return (
		<CacheProvider value={rsbsStylesCache}>
			<Global styles={css(rsbsStyles as string)} />
			<GlobalStyles
				styles={(theme) => ({
					':root': {
						'--rsbs-handle-bg': theme.palette.divider,
						'--rsbs-bg': theme.palette.background.paper
					}
				})}
			/>
			{bottomSheetList.map(({ content, props: bottomSheetProps }) => {
				return (
					<BottomSheet
						{...bottomSheetProps}
						reactSuspenseFallback={reactSuspenseFallback}
						show={isBottomSheetActive(bottomSheetProps.bottomSheetId, bottomSheetProps.containerId)}
						key={`bottom-sheet-${bottomSheetProps.containerId}-${bottomSheetProps.bottomSheetId}`}
					>
						{content}
					</BottomSheet>
				);
			})}
		</CacheProvider>
	);
}
