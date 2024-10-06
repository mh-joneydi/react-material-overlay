import 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/plugins/share';
import 'yet-another-react-lightbox/plugins/slideshow';
import 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/plugins/zoom';

import React from 'react';
import {
	ButtonProps,
	CardContentProps,
	CardHeaderProps,
	CollapseProps,
	DialogActionsProps,
	DialogContentProps,
	DialogProps,
	DialogTitleProps,
	FadeProps,
	GrowProps,
	IconButtonProps,
	SlideProps,
	Theme,
	ZoomProps
} from '@mui/material';
import { LightboxProps } from 'yet-another-react-lightbox';

import { ICloseButtonProps } from './components/CloseButton';
import { transitionPreset } from './components/getPresetTransitionComponent';
import { HeaderProps } from './components/Modal/ModalHeader';

export type Id = number | string;

export type Notify = () => void;

export type IFrequentlyUsedDialogProps = Pick<
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

export interface IModalCommonOptions extends IFrequentlyUsedDialogProps {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
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
	 * Adjust the transition with [`preset Transitions`]('https://mui.com/material-ui/transitions/').
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
		| keyof IFrequentlyUsedDialogProps
	>;
	/**
	 * Pass a custom Modal Header
	 *
	 * By default, the Header element is [`CardHeader`]('https://mui.com/material-ui/api/card-header/')
	 */
	header?: boolean | ((params: HeaderProps) => React.ReactNode) | React.ReactElement<HeaderProps>;
	/**
	 * Props for the Header component
	 *
	 *  @see {@link https://mui.com/material-ui/api/card-header/#props} for more details.
	 */
	headerProps?: Omit<CardHeaderProps, 'children' | 'title' | 'subheader'>;
	/**
	 * Props for the wrapper component of content
	 *
	 *  @see {@link https://mui.com/material-ui/api/card-content/#props} for more details.
	 */
	contentWrapperProps?: Omit<CardContentProps, 'children'>;
}

export interface IModalContainerProps extends IModalCommonOptions {
	classes?: DialogProps['classes'];
}

export interface IModalOptions extends IModalCommonOptions {
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
	sequenceNumber: number;
	show: boolean;
	children: React.ReactNode;
	closeModal: () => Promise<void>;
	deleteModal: () => void;
	reactSuspenseFallback?: React.ReactNode;
	classes?: DialogProps['classes'];
}

export interface INotValidatedModalProps extends Partial<IModalProps> {
	modalId: Id;
	sequenceNumber: number;
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

export interface IActionButtonsProps {
	defaultButtons: React.ReactNode;
	closeAlertDialog: IAlertDialogProps['closeAlertDialog'];
}

export interface IAlertDialogCommonOptions extends IFrequentlyUsedDialogProps {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * ok action button label
	 *
	 * @default "ok"
	 */
	confirmOkText?: string;
	/**
	 * Props for the ok button to more cutomization
	 *
	 *  @see {@link https://mui.com/material-ui/api/button/#props} for more details.
	 */
	confirmOkButtonProps?: Omit<ButtonProps, 'children' | 'onClick'>;
	/**
	 * cancel action button label
	 *
	 * @default "cancel"
	 */
	confirmCancelText?: string;
	/**
	 * Props for the ok button to more cutomization
	 *
	 *  @see {@link https://mui.com/material-ui/api/button/#props} for more details.
	 */
	confirmCancelButtonProps?: Omit<ButtonProps, 'children' | 'onClick'>;
	/**
	 * Pass custom Dialog Actions
	 *
	 * By default, actions are ok and cancel
	 */
	actionButtons?: ((props: IActionButtonsProps) => React.ReactNode) | React.ReactElement<IActionButtonsProps>;
	/**
	 * Adjust the transition with [`preset Transitions`]('https://mui.com/material-ui/transitions/').
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
		| keyof IFrequentlyUsedDialogProps
	>;
	/**
	 * Props for the DialogTitle component
	 *
	 *  @see {@link https://mui.com/material-ui/api/dialog-title/#props} for more details.
	 */
	DialogTitleProps?: Omit<DialogTitleProps, 'children'>;
	/**
	 * Props for the DialogContent
	 *
	 *  @see {@link https://mui.com/material-ui/api/dialog-content/#props} for more details.
	 */
	DialogContentProps?: Omit<DialogContentProps, 'children'>;
	/**
	 * Props for the DialogActions
	 *
	 *  @see {@link https://mui.com/material-ui/api/dialog-actions/#props} for more details.
	 */
	DialogActionsProps?: Omit<DialogActionsProps, 'children'>;
}

export interface IAlertDialogContainerProps extends IAlertDialogCommonOptions {
	classes?: DialogProps['classes'];
}

export interface IAlertDialogOptions extends IAlertDialogCommonOptions {
	/**
	 * Set a custom `alertDialogId` for prevent duplicating
	 */
	alertDialogId?: Id;

	/**
	 * alert dialog content
	 */
	content?: React.ReactNode;

	/**
	 * alert dialog title
	 */
	title?: React.ReactNode;

	/**
	 * Called when alert dialog is mounted.
	 */
	onOpen?: () => void;

	/**
	 * Called when alert dialog is unmounted.
	 */
	onClose?: () => void;

	/**
	 * Called when cancel button clicked
	 */
	onConfirmCancel?: () => void;

	/**
	 * Called when ok button clicked
	 */
	onConfirmOk?: () => void;
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

export interface IAlertDialogProps extends IAlertDialogOptions {
	alertDialogId: Id;
	containerId: Id;
	sequenceNumber: number;
	show: boolean;
	closeAlertDialog: () => Promise<void>;
	deleteAlertDialog: () => void;
	reactSuspenseFallback?: React.ReactNode;
	classes?: DialogProps['classes'];
}

export interface INotValidatedAlertDialogProps extends Partial<IAlertDialogProps> {
	alertDialogId: Id;
	sequenceNumber: number;
}

export interface ILightboxCommonOptions {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;

	on?: LightboxProps['on'];
	render?: LightboxProps['render'];
	labels?: LightboxProps['labels'];
	toolbarOptions?: LightboxProps['toolbar'];
	carouselOptions?: LightboxProps['carousel'];
	animationOptions?: LightboxProps['animation'];
	controllerOptions?: LightboxProps['controller'];
	noScrollOptions?: LightboxProps['noScroll'];

	/**
	 * customization styles
	 *
	 * The styles that are defined in the container are merged with the styles that you define when pushing new lightbox
	 */
	styles?: LightboxProps['styles'] | ((theme: Theme) => LightboxProps['styles']);

	/**
	 * if `true`, [`Captions plugin`]('https://yet-another-react-lightbox.com/plugins/captions') will be used
	 * @default true
	 */
	captions?: boolean;
	/**
	 * [`Captions plugin`]('https://yet-another-react-lightbox.com/plugins/captions') settings
	 */
	captionsOptions?: LightboxProps['captions'];

	/**
	 * if `true`, [`Counter plugin`]('https://yet-another-react-lightbox.com/plugins/counter') will be used
	 * @default false
	 */
	counter?: boolean;
	/**
	 * [`Counter plugin`]('https://yet-another-react-lightbox.com/plugins/counter') settings
	 */
	counterOptions?: LightboxProps['counter'];

	/**
	 * if `true`, [`Download plugin`]('https://yet-another-react-lightbox.com/plugins/download') will be used
	 * @default false
	 */
	download?: boolean;
	/**
	 * [`Download plugin`]('https://yet-another-react-lightbox.com/plugins/download') settings
	 */
	downloadOptions?: LightboxProps['download'];

	/**
	 * if `true`, [`Fullscreen plugin`]('https://yet-another-react-lightbox.com/plugins/fullscreen') will be used
	 * @default true
	 */
	fullscreen?: boolean;
	/**
	 * [`Fullscreen plugin`]('https://yet-another-react-lightbox.com/plugins/fullscreen') settings
	 */
	fullscreenOptions?: LightboxProps['fullscreen'];

	/**
	 * if `true`, [`Share plugin`]('https://yet-another-react-lightbox.com/plugins/share') will be used
	 * @default false
	 */
	share?: boolean;
	/**
	 * [`Share plugin`]('https://yet-another-react-lightbox.com/plugins/share') settings
	 */
	shareOptions?: LightboxProps['share'];

	/**
	 * if `true`, [`Slideshow plugin`]('https://yet-another-react-lightbox.com/plugins/slideshow') will be used
	 * 	@default false
	 */
	slideshow?: boolean;
	/**
	 * [`Slideshow plugin`]('https://yet-another-react-lightbox.com/plugins/slideshow') settings
	 */
	slideshowOptions?: LightboxProps['slideshow'];

	/**
	 * if `true`, [`Thumbnails plugin`]('https://yet-another-react-lightbox.com/plugins/thumbnails') will be used.
	 * @default true
	 */
	thumbnails?: boolean;
	/**
	 * [`Thumbnails plugin`]('https://yet-another-react-lightbox.com/plugins/thumbnails') settings
	 */
	thumbnailsOptions?: LightboxProps['thumbnails'];

	/**
	 * [`Video plugin`]('https://yet-another-react-lightbox.com/plugins/video') settings
	 * - The video plugin is used by default
	 */
	videoOptions?: LightboxProps['video'];

	/**
	 * if `true`, [`Zoom plugin`]('https://yet-another-react-lightbox.com/plugins/zoom') will be used.
	 * @default true
	 */
	zoom?: boolean;
	/**
	 * [`Zoom plugin`]('https://yet-another-react-lightbox.com/plugins/zoom') settings
	 */
	zoomOptions?: LightboxProps['zoom'];

	/**
	 * add extra plugins
	 */
	extraPlugins?: LightboxProps['plugins'];
}

export interface ILightboxContainerProps extends ILightboxCommonOptions {
	className?: LightboxProps['className'];
}

export interface ILightboxOptions extends ILightboxCommonOptions {
	/**
	 * Set a custom `lightboxId` for prevent duplicating
	 */
	lightboxId?: Id;

	/**
	 * Called when lightbox is mounted.
	 */
	onOpen?: () => void;

	/**
	 * Called when lightbox is unmounted.
	 */
	onClose?: () => void;

	slides: LightboxProps['slides'];
	/**
	 * Override or extend the styles applied to the component.
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
	className?:
		| ((defaultClassName: LightboxProps['className']) => LightboxProps['className'])
		| LightboxProps['className'];
}

export interface ILightboxProps extends ILightboxOptions {
	lightboxId: Id;
	containerId: Id;
	sequenceNumber: number;
	show: boolean;
	closeLightbox: () => Promise<void>;
	deleteLightbox: () => void;
	className?: LightboxProps['className'];
}

export interface INotValidatedLightboxProps extends Partial<ILightboxProps> {
	lightboxId: Id;
	sequenceNumber: number;
}
