import { IModalContainerProps } from '../../core/Modal/types';
import { useModalContainer } from '../../hooks';
import enhancedMerge from '../../utils/enhancedMerge';

import defaultProps from './defaultProps';
import Modal from './Modal';

export default function ModalContainer(props: Partial<IModalContainerProps>) {
	const containerProps = enhancedMerge(defaultProps, props);

	const { isModalActive, modalList } = useModalContainer(containerProps);

	return modalList.map(({ content, props: modalProps }) => {
		return (
			<Modal
				{...modalProps}
				show={isModalActive(modalProps.modalId, modalProps.containerId)}
				key={`modal-${modalProps.containerId}-${modalProps.modalId}`}
			>
				{content}
			</Modal>
		);
	});
}
