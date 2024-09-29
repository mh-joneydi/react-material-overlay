import { useModalContainer } from '../../hooks/Modal/useModalContainer';
import { IModalContainerProps } from '../../types';

import Modal from './Modal';

export const defaultProps: IModalContainerProps = {};

export default function ModalContainer(props: IModalContainerProps) {
	const containerProps = {
		...defaultProps,
		...props
	};

	const { isModalActive, modalList } = useModalContainer(containerProps);

	return modalList.map(({ content, props: modalProps }) => (
		<Modal
			{...modalProps}
			show={isModalActive(modalProps.modalId, modalProps.containerId)}
			key={`modal-${modalProps.modalId}`}
		>
			{content}
		</Modal>
	));
}
