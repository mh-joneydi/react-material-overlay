import React from 'react';
import { BottomSheet as RSBottomSheet } from 'react-spring-bottom-sheet';
import { GlobalStyles } from '@mui/material';

import { RmoStack } from '../../core';
import { BottomSheetRef, IBottomSheetProps } from '../../core/BottomSheet/types';
import SuspenseFallback from '../SuspenseFallback';

export default React.forwardRef<BottomSheetRef, IBottomSheetProps>(function BottomSheet(
	{
		children,
		show,
		deleteBottomSheet,
		closeBottomSheet,
		reactSuspenseFallback,
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
		BottomSheetProps,
		rmoStackId,
		sx
	},
	ref
) {
	const sequenceNumber = React.useRef(RmoStack.findIndexById(rmoStackId)).current;
	const rsbsId = `rsbs-${containerId}-${bottomSheetId}`;

	return (
		<>
			<GlobalStyles
				styles={(theme) => ({
					[`#${rsbsId} [data-rsbs-overlay], #${rsbsId} [data-rsbs-backdrop], #${rsbsId}[data-rsbs-root]:after`]: {
						zIndex: theme.zIndex.modal + sequenceNumber
					},
					...(!!sx && {
						[`#${rsbsId}`]: theme.unstable_sx(sx)
					})
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
