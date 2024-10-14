import { ForwardedRef } from 'react';
import { BottomSheetProps, BottomSheetRef as RSBSBottomSheetRef } from 'react-spring-bottom-sheet';
import { SxProps, Theme } from '@mui/material';

import { Id } from '../../types';

export type RSBSProps = Pick<
	BottomSheetProps,
	| 'header'
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
	bottomSheetProps: RSBSProps & Pick<IBottomSheetProps, 'bottomSheetId' | 'containerId'>;
}

export type BottomSheetContentProps = IBottomSheetCustomRenderProps;
export type BottomSheetFooterProps = IBottomSheetCustomRenderProps;
export type BottomSheetSiblingProps = IBottomSheetCustomRenderProps;

export type BottomSheetRef = RSBSBottomSheetRef;

export interface IBottomSheetCommonOptions extends RSBSProps {
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
	 * set default options for modals
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
	rmoStackId: Id;
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
	rmoStackId: Id;
}

export type BottomSheetContent = React.ReactNode | ((props: BottomSheetContentProps) => React.ReactNode);

export interface IBottomSheet {
	content: React.ReactNode;
	props: IBottomSheetProps;
}
