import React from 'react';

export type Id = number | string;

export type Notify = () => void;

export interface ICommonOptions {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
}

export interface IModalContainerProps extends ICommonOptions {}

export interface IModalOptions extends ICommonOptions {
	/**
	 * Set a custom `modalId`
	 */
	modalId?: Id;

	/**
	 * modal title
	 */
	title?: string;

	/**
	 * Called when modal is mounted.
	 */
	onOpen?: () => void;

	/**
	 * Called when modal is unmounted.
	 */
	onClose?: () => void;
}

export interface IModalProps extends IModalOptions {
	modalId: Id;
	containerId: Id;
	sequenceNumber: number;
	show: boolean;
	children: React.ReactNode;
	closeModal: () => void;
	deleteModal: () => void;
}

export interface INotValidatedModalProps extends Partial<IModalProps> {
	modalId: Id;
}

export interface IModal {
	content: React.ReactNode;
	props: IModalProps;
}

export interface IPushModalPayload {
	content: React.ReactNode;
	options?: IModalOptions;
	sequenceNumber: number;
}

export interface IPopModalPayload {
	containerId: Id;
}
