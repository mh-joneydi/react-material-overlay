import React from 'react';
import { BottomSheet as RSBottomSheet } from 'react-spring-bottom-sheet';
import { GlobalStyles } from '@mui/material';

import { BottomSheetRef, IBottomSheetProps } from '../../core/BottomSheet/types';
import SuspenseFallback from '../SuspenseFallback';

export default React.forwardRef<BottomSheetRef, IBottomSheetProps>(function BottomSheet(
	{
		children,
		show,
		deleteBottomSheet,
		closeBottomSheet,
		reactSuspenseFallback,
		sequenceNumber,
		bottomSheetId,
		containerId,
		blocking,
		className,
		defaultSnap,
		expandOnContentDrag,
		footer,
		header,
		initialFocusRef,
		maxHeight,
		onSpringCancel,
		onSpringEnd,
		onSpringStart,
		reserveScrollBarGap,
		scrollLocking,
		sibling,
		skipInitialTransition,
		snapPoints,
		BottomSheetProps
	},
	ref
) {
	const rsbsId = `rsbs-${containerId}-${bottomSheetId}`;
	return (
		<>
			<GlobalStyles
				styles={(theme) => ({
					[`#${rsbsId} [data-rsbs-overlay], #${rsbsId} [data-rsbs-backdrop], #${rsbsId}[data-rsbs-root]:after`]: {
						zIndex: theme.zIndex.modal + sequenceNumber
					}
				})}
			/>

			<RSBottomSheet
				{...BottomSheetProps}
				ref={ref}
				blocking={blocking}
				className={className}
				defaultSnap={defaultSnap}
				expandOnContentDrag={expandOnContentDrag}
				footer={footer}
				header={header}
				initialFocusRef={initialFocusRef}
				maxHeight={maxHeight}
				onSpringCancel={onSpringCancel}
				onSpringStart={onSpringStart}
				reserveScrollBarGap={reserveScrollBarGap}
				scrollLocking={scrollLocking}
				sibling={sibling}
				skipInitialTransition={skipInitialTransition}
				snapPoints={snapPoints}
				id={rsbsId}
				open={show}
				onDismiss={closeBottomSheet}
				onSpringEnd={(event) => {
					if (event.type === 'CLOSE') {
						deleteBottomSheet();
					}

					onSpringEnd?.(event);
				}}
			>
				<React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>{children}</React.Suspense>
			</RSBottomSheet>
		</>
	);
});
