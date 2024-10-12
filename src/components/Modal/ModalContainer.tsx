import { IModalContainerProps } from '../../core/Modal/types';
import { useModalContainer } from '../../hooks/Modal/useModalContainer';
import enhancedMerge from '../../utils/enhancedMerge';

import Modal from './Modal';

interface ModalContainerProps {
	reactSuspenseFallback?: React.ReactNode;
	defaultOptions?: IModalContainerProps;
}

export const defaultProps: ModalContainerProps = {
	defaultOptions: {
		scroll: 'paper',
		closeOnBackdropClick: true,
		fullWidth: false,
		maxWidth: 'sm',
		fullScreen: false,
		closeButton: true,
		header: true
	}
};

export default function ModalContainer(props: ModalContainerProps) {
	const { defaultOptions, reactSuspenseFallback } = enhancedMerge(defaultProps, props);

	const { isModalActive, modalList } = useModalContainer(defaultOptions!);

	return modalList.map(({ content, props: modalProps }) => {
		return (
			<Modal
				{...modalProps}
				reactSuspenseFallback={reactSuspenseFallback}
				show={isModalActive(modalProps.modalId, modalProps.containerId)}
				key={`modal-${modalProps.containerId}-${modalProps.modalId}`}
			>
				{content}
			</Modal>
		);
	});
}
