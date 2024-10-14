import {
	ButtonProps,
	CollapseProps,
	DialogActionsProps,
	DialogContentProps,
	DialogProps,
	DialogTitleProps,
	FadeProps,
	GrowProps,
	SlideProps,
	ZoomProps
} from '@mui/material';

import { transitionPreset } from '../../components/getPresetTransitionComponent';
import { Id } from '../../types';

export interface IActionButtonsProps {
	defaultButtons: React.ReactNode;
	closeAlertDialog: IAlertDialogProps['closeAlertDialog'];
}

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

export interface IAlertDialogCommonOptions extends IFrequentlyUsedDialogProps {
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
	 * set default options for modals
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
	rmoStackId: Id;
	show: boolean;
	closeAlertDialog: () => Promise<void>;
	deleteAlertDialog: () => void;
	classes?: DialogProps['classes'];
}

export interface INotValidatedAlertDialogProps extends Partial<IAlertDialogProps> {
	alertDialogId: Id;
	rmoStackId: Id;
}
