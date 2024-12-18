import {
	BoxProps,
	CardHeaderProps,
	CollapseProps,
	DialogProps,
	FadeProps,
	GrowProps,
	IconButtonProps,
	SlideProps,
	ZoomProps
} from '@mui/material';

import { ICloseButtonProps } from '../../components/CloseButton';
import { transitionPreset } from '../../components/getPresetTransitionComponent';
import { Id } from '../../types';

export type IModalFrequentlyUsedDialogProps = Pick<
	DialogProps,
	| 'fullScreen'
	| 'fullWidth'
	| 'maxWidth'
	| 'scroll'
	| 'transitionDuration'
	| 'TransitionComponent'
	| 'PaperComponent'
	| 'PaperProps'
	| 'sx'
	| 'slots'
	| 'slotProps'
>;

export interface IModalContentWrapperProps
	extends Pick<
		IModalProps,
		| 'containerId'
		| 'modalId'
		| 'contentWrapperProps'
		| 'fullScreen'
		| 'fullWidth'
		| 'maxWidth'
		| 'scroll'
		| 'transitionPreset'
		| 'transitionProps'
		| 'closeModal'
	> {
	children: React.ReactNode;
}

export interface IModalHeaderProps
	extends Pick<
		IModalProps,
		| 'containerId'
		| 'modalId'
		| 'title'
		| 'subheader'
		| 'headerProps'
		| 'fullScreen'
		| 'scroll'
		| 'maxWidth'
		| 'transitionPreset'
		| 'transitionProps'
		| 'closeModal'
	> {
	closeButton?: React.ReactNode;
}

export interface IModalCommonOptions extends IModalFrequentlyUsedDialogProps {
	/**
	 * Pass a custom close button.
	 * To remove the close button pass `false`
	 *
	 * By default, the closeButton element is [`IconButton`](https://mui.com/material-ui/api/icon-button/)
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
	closeButtonIcon?:
		| React.ReactNode
		| ((props: Pick<IModalCommonOptions, 'transitionPreset' | 'transitionProps' | 'fullScreen'>) => React.ReactNode);
	/**
	 * If `true`, only the `content` will be displayed raw in the modal
	 *
	 * @default false
	 */
	raw?: boolean;
	/**
	 * Adjust the transition with [`preset Transitions`](https://mui.com/material-ui/transitions/).
	 *
	 * If you want more customization, use `TransitionComponent` prop.
	 *
	 * @see {@link https://mui.com/material-ui/transitions/#transitioncomponent-prop} for more details.
	 *
	 * @default 'fade'
	 */
	transitionPreset?: transitionPreset;
	/**
	 * Props are applied to the transition element. Both the `transitionPreset` and `TransitionComponent`
	 *
	 *  @see {@link https://mui.com/material-ui/transitions/} for more details.
	 */
	transitionProps?: Omit<SlideProps & GrowProps & FadeProps & ZoomProps & CollapseProps, 'children'>;
	/**
	 * If `true`, the modal will close when the backdrop is clicked.
	 *
	 * @default true
	 */
	closeOnBackdropClick?: boolean;
	/**
	 * Props for the Dialog component to more cutomization
	 *
	 *  @see {@link https://mui.com/material-ui/api/dialog/#props} for more details.
	 */
	DialogProps?: Omit<
		DialogProps,
		| 'onTransitionExited'
		| 'open'
		| 'onClose'
		| 'children'
		| 'TransitionProps'
		| 'classes'
		| keyof IModalFrequentlyUsedDialogProps
	>;
	/**
	 * Pass a custom Modal Header or `false` to remove header
	 *
	 * By default, the Header element is [`CardHeader`](https://mui.com/material-ui/api/card-header/)
	 */
	header?: boolean | ((params: IModalHeaderProps) => React.ReactNode) | React.ReactElement<IModalHeaderProps>;
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
	 * pushModal("content", {
	 * 	contentWrapper: ({ children, ...otherProps })=> <MyContentWrapper>{children}</MyContentWrapper>
	 * })
	 * ```
	 */
	contentWrapper?:
		| boolean
		| ((params: IModalContentWrapperProps) => React.ReactNode)
		| React.ReactElement<IModalContentWrapperProps>;
	/**
	 * Props for the wrapper component of content
	 *
	 *  @see {@link https://mui.com/material-ui/api/box/#props} for more details.
	 */
	contentWrapperProps?: Omit<BoxProps, 'children'>;
	/**
	 * Set custom React Suspense Fallback UI instead default for lazy contents
	 */
	reactSuspenseFallback?: React.ReactNode;
}

export interface IModalDefaultOptions extends IModalCommonOptions {
	classes?: DialogProps['classes'];
}

export interface IModalContainerProps {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * set default options for modals
	 */
	defaultOptions: IModalDefaultOptions;
}

export interface IModalOptions extends IModalCommonOptions {
	/**
	 * container id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * Set a custom `modalId` for prevent duplicating
	 */
	modalId?: Id;
	/**
	 * modal title
	 */
	title?: React.ReactNode;
	/**
	 * modal sub header title
	 */
	subheader?: React.ReactNode;
	/**
	 * Called when modal is mounted.
	 */
	onOpen?: () => void;
	/**
	 * Called when modal is unmounted.
	 */
	onClose?: () => void;
	/**
	 * Override or extend the styles applied to the component.
	 *
	 * - Merge with default classes that defined in Container:
	 * ```
	 * {
	 *   classes: { paper: 'some-class'}
	 * }
	 * ```
	 *
	 * - Overwrite on default classes that defined in Container
	 * ```
	 * {
	 *   classes: (defaultClasses)=> ({ paper: 'some-class'})
	 * }
	 * ```
	 */
	classes?: DialogProps['classes'] | ((defaultClasses: DialogProps['classes']) => DialogProps['classes']);
}

export interface IModalProps extends IModalOptions {
	modalId: Id;
	containerId: Id;
	show: boolean;
	children: React.ReactNode;
	closeModal: () => Promise<void>;
	deleteModal: () => void;
	classes?: DialogProps['classes'];
}

export interface INotValidatedModalProps extends Partial<IModalProps> {
	modalId: Id;
}

export interface IModalContentProps {
	closeModal: IModalProps['closeModal'];
	modalProps: IModalProps;
}

export type ModalContent = React.ReactNode | ((props: IModalContentProps) => React.ReactNode);

export interface IModal {
	content: React.ReactNode;
	props: IModalProps;
}
