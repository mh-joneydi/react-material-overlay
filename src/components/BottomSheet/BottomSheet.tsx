import React from 'react';
import { BottomSheet as RSBottomSheet } from 'react-spring-bottom-sheet';
import { Backdrop, GlobalStyles, Portal } from '@mui/material';

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
import useBlockEscapeKey from '../useBlockEscapeKey';

import BottomSheetContentWrapper from './BottomSheetContentWrapper';
import BottomSheetDefaultHeader from './BottomSheetDefaultHeader';

export default React.forwardRef<BottomSheetRef, IBottomSheetProps>(function BottomSheet(props, ref) {
	const {
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
		closeButton,
		closeButtonIcon,
		defaultHeader,
		contentWrapper,
		closeOnBackdropClick,
		closeOnEscape
	} = props;
	const sequenceNumber = useRmoStackItemIndex(bottomSheetId);
	const rsbsId = `rsbs-${containerId}-${bottomSheetId}`;

	useBlockEscapeKey(bottomSheetId, show, closeOnEscape === false ? undefined : closeBottomSheet);

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
		...props,
		closeButton: Close
	};

	let Header: React.ReactNode;

	if (header === false) {
		Header = false;
	} else if (isFn(header)) {
		Header = header(_headerProps);
	} else if (React.isValidElement(header)) {
		const headerElementProps = { ..._headerProps };
		delete headerElementProps.children;
		delete headerElementProps.ref;
		Header = React.cloneElement(header, headerElementProps);
	} else if (defaultHeader !== false) {
		Header = BottomSheetDefaultHeader(_headerProps);
	}

	const content = <React.Suspense fallback={reactSuspenseFallback || <SuspenseFallback />}>{children}</React.Suspense>;

	const _contentWrapperProps: IBottomSheetContentWrapperProps = {
		...props,
		children: content
	};

	let WrappedContent: React.ReactNode;

	if (contentWrapper === false) {
		WrappedContent = content;
	} else if (isFn(contentWrapper)) {
		WrappedContent = contentWrapper(_contentWrapperProps);
	} else if (React.isValidElement(contentWrapper)) {
		const contentWrapperElementProps = { ..._contentWrapperProps };
		delete contentWrapperElementProps.ref;
		WrappedContent = React.cloneElement(contentWrapper, contentWrapperElementProps);
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
					[`#${rsbsId} [data-rsbs-backdrop]`]: {
						display: 'none'
					},
					...(!!sx && {
						[`#${rsbsId}`]: theme.unstable_sx(sx)
					})
				})}
			/>

			{blocking !== false && (
				<Portal>
					<Backdrop
						open={show}
						slotProps={{
							root: {
								onClick: () => {
									if (closeOnBackdropClick !== false) {
										closeBottomSheet();
									}
								},
								sx: (theme) => ({
									zIndex: theme.zIndex.modal + sequenceNumber
								})
							}
						}}
					/>
				</Portal>
			)}

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
