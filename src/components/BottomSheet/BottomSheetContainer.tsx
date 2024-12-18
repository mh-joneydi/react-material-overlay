import rsbsStyles from 'react-spring-bottom-sheet/dist/style.css';
import { css, Global } from '@emotion/react';
import { GlobalStyles } from '@mui/material';

import { IBottomSheetContainerProps } from '../../core/BottomSheet/types';
import { useBottomSheetContainer } from '../../hooks';
import enhancedMerge from '../../utils/enhancedMerge';

import BottomSheet from './BottomSheet';

export const defaultProps: IBottomSheetContainerProps = {
	defaultOptions: {
		initialFocusRef: false
	}
};

export default function ModalContainer(props: Partial<IBottomSheetContainerProps>) {
	const containerProps = enhancedMerge(defaultProps, props);

	const { isBottomSheetActive, bottomSheetList } = useBottomSheetContainer(containerProps);

	return (
		<>
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
						show={isBottomSheetActive(bottomSheetProps.bottomSheetId, bottomSheetProps.containerId)}
						key={`bottom-sheet-${bottomSheetProps.containerId}-${bottomSheetProps.bottomSheetId}`}
					>
						{content}
					</BottomSheet>
				);
			})}
		</>
	);
}
