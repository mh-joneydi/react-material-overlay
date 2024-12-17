import React from 'react';
import { BottomSheet as RSBottomSheet } from 'react-spring-bottom-sheet';
import { GlobalStyles } from '@mui/material';

import {
	BottomSheetRef,
	IBottomSheetContentWrapperProps,
	IBottomSheetHeaderProps,
	IBottomSheetProps
} from '../../core/BottomSheet/types';
import { useRmoStackItemIndex } from '../../hooks';
import { isFn } from '../../utils';
import CloseButton, { ICloseButtonProps } from '../CloseButton';
import CloseButtonIcon from '../CloseButtonIcon';
import SuspenseFallback from '../SuspenseFallback';

import BottomSheetContentWrapper from './BottomSheetContentWrapper';
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
		contentWrapperProps,
		contentWrapper
	},
	ref
) {
	const sequenceNumber = useRmoStackItemIndex(bottomSheetId);
	const rsbsId = `rsbs-${containerId}-${bottomSheetId}`;

	const _closeButtonProps: ICloseButtonProps = {
		closeButtonProps,
		closeHandler: closeBottomSheet,
		icon: closeButtonIcon || <CloseButtonIcon />
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

	const _headerProps: IBottomSheetHeaderProps = {
		closeButton: Close,
		closeBottomSheet,
		bottomSheetId,
		containerId,
		blocking,
		defaultSnap,
		expandOnContentDrag,
		maxHeight,
		reserveScrollBarGap,
		scrollLocking,
		snapPoints,
		headerProps,
		subheader,
		title
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

	const content = <React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>{children}</React.Suspense>;

	const _contentWrapperProps: IBottomSheetContentWrapperProps = {
		bottomSheetId,
		closeBottomSheet,
		containerId,
		blocking,
		contentWrapperProps,
		defaultSnap,
		expandOnContentDrag,
		maxHeight,
		reserveScrollBarGap,
		scrollLocking,
		snapPoints,
		children: content
	};

	let WrappedContent: React.ReactNode;

	if (contentWrapper === false) {
		WrappedContent = content;
	} else if (isFn(contentWrapper)) {
		WrappedContent = contentWrapper(_contentWrapperProps);
	} else if (React.isValidElement(contentWrapper)) {
		WrappedContent = React.cloneElement(contentWrapper, _contentWrapperProps);
	} else {
		WrappedContent = BottomSheetContentWrapper(_contentWrapperProps);
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
				{WrappedContent}
			</RSBottomSheet>
		</>
	);
});
