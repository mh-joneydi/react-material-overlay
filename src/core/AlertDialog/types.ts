import {
	ButtonProps,
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

import { ICloseButtonProps } from '../../components/CloseButton';
import { transitionPreset } from '../../components/getPresetTransitionComponent';
import { Id } from '../../types';

export interface IActionButtonsProps {
	defaultButtons: React.ReactNode;
	closeAlertDialog: IAlertDialogProps['closeAlertDialog'];
}

export interface IAlertDialogLayoutProps {
	title?: React.ReactNode;
	content?: React.ReactNode;
	actions: React.ReactNode;
	closeButton: React.ReactNode;
	closeAlertDialog: () => Promise<boolean>;
	DialogTitleProps?: Omit<DialogTitleProps, 'children'>;
	DialogContentProps?: Omit<DialogContentProps, 'children'>;
	DialogActionsProps?: Omit<DialogActionsProps, 'children'>;
}

export type IAlertDialogFrequentlyUsedDialogProps = Pick<
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

export interface IAlertDialogCommonOptions extends IAlertDialogFrequentlyUsedDialogProps {
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
	 * Pass a custom close button.
	 * To remove the close button pass `false`.
	 *
	 * By default, the close button is hidden. When shown, the closeButton element is [`IconButton`](https://mui.com/material-ui/api/icon-button/).
	 *
	 * @default false
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
		| ((
				props: Pick<IAlertDialogCommonOptions, 'transitionPreset' | 'transitionProps' | 'fullScreen'>
		  ) => React.ReactNode);
	/**
	 * Pass a custom layout for the alert dialog regions.
	 *
	 * By default, regions render as title, content, actions, then the close button when it is shown.
	 *
	 * @example
	 * ```
	 * pushAlertDialog({
	 *   title: 'Title',
	 *   content: 'Body',
	 *   closeButton: true,
	 *   layout: ({ title, content, actions, closeButton, DialogTitleProps, DialogContentProps, DialogActionsProps }) => (
	 *     <>
	 *       <DialogTitle {...DialogTitleProps}>{title}</DialogTitle>
	 *       <DialogContent {...DialogContentProps}>{content}</DialogContent>
	 *       <DialogActions {...DialogActionsProps}>
	 *         {actions}
	 *         {closeButton}
	 *       </DialogActions>
	 *     </>
	 *   )
	 * })
	 * ```
	 */
	layout?:
		| boolean
		| ((props: IAlertDialogLayoutProps) => React.ReactNode)
		| React.ReactElement<IAlertDialogLayoutProps>;
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
	 * If `true`, the alert dialog will close when the backdrop is clicked.
	 *
	 * @default true
	 */
	closeOnBackdropClick?: boolean;
	/**
	 * If `true`, the alert dialog will close when Escape is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;
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
		| keyof IAlertDialogFrequentlyUsedDialogProps
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
	/**
	 * Set custom React Suspense Fallback UI instead default for lazy contents
	 */
	reactSuspenseFallback?: React.ReactNode;
}

export interface IAlertDialogDefaultOptions extends IAlertDialogCommonOptions {
	classes?: DialogProps['classes'];
}

export interface IAlertDialogContainerProps {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * set default options for alertDialogs
	 */
	defaultOptions: IAlertDialogDefaultOptions;
}

export interface IAlertDialogOptions extends IAlertDialogCommonOptions {
	/**
	 * container id to handle multiple container
	 */
	containerId?: Id;
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
	show: boolean;
	closeAlertDialog: () => Promise<boolean>;
	deleteAlertDialog: () => void;
	classes?: DialogProps['classes'];
}

export interface INotValidatedAlertDialogProps extends Partial<IAlertDialogProps> {
	alertDialogId: Id;
}
