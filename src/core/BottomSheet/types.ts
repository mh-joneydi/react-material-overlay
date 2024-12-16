import { ForwardedRef } from 'react';
import { BottomSheetProps, BottomSheetRef as RSBSBottomSheetRef } from 'react-spring-bottom-sheet';
import { BoxProps, CardHeaderProps, IconButtonProps, SxProps, Theme } from '@mui/material';

import { ICloseButtonProps } from '../../components';
import { Id } from '../../types';

export type RSBSProps = Pick<
	BottomSheetProps,
	| 'initialFocusRef'
	| 'maxHeight'
	| 'blocking'
	| 'scrollLocking'
	| 'snapPoints'
	| 'reserveScrollBarGap'
	| 'defaultSnap'
	| 'skipInitialTransition'
	| 'expandOnContentDrag'
	| 'onSpringStart'
	| 'onSpringCancel'
	| 'onSpringEnd'
>;

export interface IBottomSheetCustomRenderProps {
	closeBottomSheet: IBottomSheetProps['closeBottomSheet'];
	bottomSheetProps: RSBSProps &
		Pick<IBottomSheetProps, 'bottomSheetId' | 'containerId' | 'title' | 'subheader' | 'headerProps'>;
}

export type BottomSheetContentProps = IBottomSheetCustomRenderProps;
export type BottomSheetFooterProps = IBottomSheetCustomRenderProps;

export type BottomSheetSiblingProps = IBottomSheetCustomRenderProps;

export type BottomSheetRef = RSBSBottomSheetRef;

export interface IBottomSheetHeaderProps
	extends Pick<
		IBottomSheetProps,
		| 'closeBottomSheet'
		| 'bottomSheetId'
		| 'defaultSnap'
		| 'expandOnContentDrag'
		| 'containerId'
		| 'maxHeight'
		| 'snapPoints'
		| 'title'
		| 'subheader'
		| 'headerProps'
		| 'scrollLocking'
		| 'reserveScrollBarGap'
		| 'blocking'
	> {
	closeButton?: React.ReactNode;
}
export interface IBottomSheetContentWrapperProps
	extends Pick<
		IBottomSheetProps,
		| 'closeBottomSheet'
		| 'bottomSheetId'
		| 'contentWrapperProps'
		| 'defaultSnap'
		| 'expandOnContentDrag'
		| 'containerId'
		| 'maxHeight'
		| 'snapPoints'
		| 'scrollLocking'
		| 'reserveScrollBarGap'
		| 'blocking'
	> {
	children: React.ReactNode;
}

export interface IBottomSheetCommonOptions extends RSBSProps {
	/**
	 * Pass a custom close button.
	 * To remove the close button pass `false`
	 *
	 * By default, the closeButton element is [`IconButton`]('https://mui.com/material-ui/api/icon-button/')
	 */
	closeButton?: boolean | ((props: ICloseButtonProps) => React.ReactNode) | React.ReactElement<ICloseButtonProps>;
	/**
	 * Props applied to the closeButton element.
	 *
	 *  @see {@link https://mui.com/material-ui/api/icon-button/#props} for more details.
	 */
	closeButtonProps?: IconButtonProps;
	/**
	 * Pass a custom icon for closeButton element.
	 */
	closeButtonIcon?: React.ReactNode;
	/**
	 * Similar to children, but renders next to the overlay element rather than inside it.
	 * Useful for things that are position:fixed and need to overlay the backdrop and still be interactive
	 * in blocking mode.
	 */
	sibling?: boolean | React.ReactNode | ((props: BottomSheetSiblingProps) => React.ReactNode);
	/**
	 * Renders a sticky footer at the bottom of the sheet.
	 */
	footer?: boolean | React.ReactNode | ((props: BottomSheetFooterProps) => React.ReactNode);
	/**
	 * Renders below the drag handle, set to `false` to disable the drag handle
	 *
	 * if `defaultHeader` option setted to `true`
	 *
	 * default value is Header element that is [`CardHeader`]('https://mui.com/material-ui/api/card-header/')
	 *
	 * otherwise default value is `true`
	 */
	header?: boolean | React.ReactNode | ((props: IBottomSheetHeaderProps) => React.ReactNode);
	/**
	 * Props for the Header component
	 *
	 *  @see {@link https://mui.com/material-ui/api/card-header/#props} for more details.
	 */
	headerProps?: Omit<CardHeaderProps, 'children' | 'title' | 'subheader'>;
	/**
	 * Pass a custom Modal content wrapper or `false` to remove wrapper
	 *
	 * By default, the Content wrapper element is a [`Box`](https://mui.com/material-ui/api/box/)
	 *
	 * @example
	 * ```
	 * pushBottomSheet("content", {
	 * 	contentWrapper: ({ children, ...otherProps })=> <MyContentWrapper>{children}</MyContentWrapper>
	 * })
	 * ```
	 */
	contentWrapper?:
		| boolean
		| ((params: IBottomSheetContentWrapperProps) => React.ReactNode)
		| React.ReactElement<IBottomSheetContentWrapperProps>;
	/**
	 * Props for the wrapper component of content
	 *
	 *  @see {@link https://mui.com/material-ui/api/box/#props} for more details.
	 */
	contentWrapperProps?: Omit<BoxProps, 'children'>;
	/**
	 * if `true`, default header element will be rendered.
	 *
	 * By default, the Header element is [`CardHeader`]('https://mui.com/material-ui/api/card-header/')
	 *
	 * for more customization work with `header` option.
	 *
	 * @default true
	 */
	defaultHeader?: boolean;
	/**
	 * Called when modal is mounted.
	 */
	/**
	 * ButtonSheet ref
	 * @example
	 * const sheetRef = useRef<BottomSheetRef>();
	 * // somewhere in your component
	 * sheetRef.current.snapTo(({ maxHeight }) => maxHeight)
	 */
	ref?: ForwardedRef<BottomSheetRef>;
	/**
	 * Props for the BottomSheet component (root element) to more cutomization.
	 */
	BottomSheetProps?: Omit<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, 'children' | 'id' | 'className'>;
	/**
	 * allows defining additional CSS styles in root element.
	 */
	sx?: SxProps<Theme>;
}

export interface IBottomSheetDefaultOptions extends IBottomSheetCommonOptions {
	/** CSS class of the BottomSheet root element */
	className?: BottomSheetProps['className'];
}

export interface IBottomSheetContainerProps {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * set default options for bottomSheets
	 */
	defaultOptions: IBottomSheetDefaultOptions;
}

export interface IBottomSheetOptions extends IBottomSheetCommonOptions {
	/**
	 * container id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * Set a custom `bottomSheetId` for prevent duplicating
	 */
	bottomSheetId?: Id;
	/**
	 * bottomsheet title
	 */
	title?: React.ReactNode;
	/**
	 * bottomsheet sub header title
	 */
	subheader?: React.ReactNode;
	/**
	 * Called when bottomSheet is mounted.
	 */
	onOpen?: () => void;
	/**
	 * Called when bottomSheet is unmounted.
	 */
	onClose?: () => void;
	/**
	 * CSS class of the BottomSheet root element.
	 *
	 * - Auto merge with default className that defined in Container:
	 * ```
	 * {
	 *   className: "some-class"
	 * }
	 * ```
	 *
	 * -  Manual merge or overwrite default className that defined in Container
	 * ```
	 * {
	 *   className: (defaultClassName)=> "overwrited-clsss"
	 * }
	 * ```
	 */
	className?: BottomSheetProps['className'];
}

export interface IBottomSheetProps extends IBottomSheetOptions {
	bottomSheetId: Id;
	containerId: Id;
	show: boolean;
	children: React.ReactNode;
	closeBottomSheet: () => Promise<void>;
	deleteBottomSheet: () => void;
	reactSuspenseFallback?: React.ReactNode;
	className?: BottomSheetProps['className'];
	footer?: React.ReactNode;
	sibling?: React.ReactNode;
}

export interface INotValidatedBottomSheetProps extends Partial<IBottomSheetOptions> {
	bottomSheetId: Id;
}

export type BottomSheetContent = React.ReactNode | ((props: BottomSheetContentProps) => React.ReactNode);

export interface IBottomSheet {
	content: React.ReactNode;
	props: IBottomSheetProps;
}
