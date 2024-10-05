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
	ZoomProps
} from '@mui/material';

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
	 * Set a custom `modalId`
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
	closeModal: () => void;
	deleteModal: () => void;
	reactSuspenseFallback?: React.ReactNode;
	defaultSx?: IModalCommonOptions['sx'];
	classes?: DialogProps['classes'];
}

export interface INotValidatedModalProps extends Partial<IModalProps> {
	modalId: Id;
	sequenceNumber: number;
}

export interface IModalContentProps {
	closeModal: () => void;
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
	 * Set a custom `alertDialogId`
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
	children: React.ReactNode;
	closeAlertDialog: () => void;
	deleteAlertDialog: () => void;
	reactSuspenseFallback?: React.ReactNode;
	defaultSx?: IAlertDialogCommonOptions['sx'];
	classes?: DialogProps['classes'];
}

export interface INotValidatedAlertDialogProps extends Partial<IAlertDialogProps> {
	alertDialogId: Id;
	sequenceNumber: number;
}
