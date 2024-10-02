import { merge } from 'lodash';

import { useModalContainer } from '../../hooks/Modal/useModalContainer';
import { IModalContainerProps } from '../../types';

import Modal from './Modal';

interface ModalContainerProps {
	reactSuspenseFallback?: React.ReactNode;
	defaultOptions: IModalContainerProps;
}

export const defaultProps: ModalContainerProps = {
	reactSuspenseFallback: 'Loading...',
	defaultOptions: {
		scroll: 'paper',
		closeOnBackdropClick: true,
		fullWidth: true,
		maxWidth: 'sm',
		fullScreen: false,
		closeButton: true,
		header: true
	}
};

export default function ModalContainer(props: ModalContainerProps) {
	const { defaultOptions: options, reactSuspenseFallback } = merge({}, defaultProps, props);

	const { isModalActive, modalList } = useModalContainer(options);

	return modalList.map(({ content, props: modalProps }) => (
		<Modal
			{...modalProps}
			reactSuspenseFallback={reactSuspenseFallback}
			show={isModalActive(modalProps.modalId, modalProps.containerId)}
			key={`${modalProps.containerId}-${modalProps.modalId}`}
		>
			{content}
		</Modal>
	));
}
