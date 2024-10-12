import {
	CardContentProps,
	CardHeaderProps,
	CollapseProps,
	DialogProps,
	FadeProps,
	GrowProps,
	IconButtonProps,
	SlideProps,
	ZoomProps
} from '@mui/material';

import { IModalCloseButtonProps } from '../../components/Modal/ModalCloseButton';
import { transitionPreset } from '../../components/getPresetTransitionComponent';
import { ModalHeaderProps } from '../../components/Modal/ModalHeader';
import { Id } from '../../types';

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
	closeButton?:
		| boolean
		| ((props: IModalCloseButtonProps) => React.ReactNode)
		| React.ReactElement<IModalCloseButtonProps>;
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
	header?: boolean | ((params: ModalHeaderProps) => React.ReactNode) | React.ReactElement<ModalHeaderProps>;
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
