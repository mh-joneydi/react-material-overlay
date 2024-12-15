import React from 'react';
import { BottomSheet as RSBottomSheet } from 'react-spring-bottom-sheet';
import { Box, GlobalStyles } from '@mui/material';

import { BottomSheetHeaderProps, BottomSheetRef, IBottomSheetProps } from '../../core/BottomSheet/types';
import { useRmoStackItemIndex } from '../../hooks';
import { isFn } from '../../utils';
import CloseButton, { ICloseButtonProps } from '../CloseButton';
import SuspenseFallback from '../SuspenseFallback';

import BottomSheetDefaultHeader from './BottomSheetDefaultHeader';

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
		sx,
		closeButtonProps,
		headerProps,
		closeButton,
		closeButtonIcon,
		defaultHeader,
		subheader,
		title,
		contentWrapperProps
	},
	ref
) {
	const sequenceNumber = useRmoStackItemIndex(bottomSheetId);
	const rsbsId = `rsbs-${containerId}-${bottomSheetId}`;

	const _closeButtonProps: ICloseButtonProps = {
		closeButtonProps,
		closeHandler: closeBottomSheet,
		icon: closeButtonIcon
	};

	let Close: React.ReactNode = null;

	if (closeButton === false) {
		// hide
	} else if (isFn(closeButton)) {
		Close = closeButton(_closeButtonProps);
	} else if (React.isValidElement(closeButton)) {
		Close = React.cloneElement(closeButton, closeButtonProps);
	} else {
		Close = CloseButton(_closeButtonProps);
	}

	const _headerProps: BottomSheetHeaderProps = {
		closeButton: Close,
		closeBottomSheet,
		bottomSheetProps: {
			bottomSheetId,
			containerId,
			blocking,
			defaultSnap,
			expandOnContentDrag,
			initialFocusRef,
			maxHeight,
			onSpringCancel,
			onSpringEnd,
			onSpringStart,
			reserveScrollBarGap,
			scrollLocking,
			skipInitialTransition,
			snapPoints,
			headerProps,
			subheader,
			title
		}
	};

	let Header: React.ReactNode;

	if (header === false) {
		Header = false;
	} else if (isFn(header)) {
		Header = header(_headerProps);
	} else if (React.isValidElement(header)) {
		Header = React.cloneElement(header, _headerProps);
	} else if (defaultHeader !== false) {
		Header = BottomSheetDefaultHeader(_headerProps);
	}

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
				header={Header}
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
				<React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>
					<Box
						padding={2}
						{...(contentWrapperProps ?? {})}
						sx={(theme) => ({
							...(isFn(contentWrapperProps?.sx)
								? (contentWrapperProps.sx as Function)(theme)
								: (contentWrapperProps?.sx ?? {}))
						})}
					>
						{children}
					</Box>
				</React.Suspense>
			</RSBottomSheet>
		</>
	);
});
