import type { Id, IModal, IModalContainerProps, IModalProps, INotValidatedModalProps, Notify } from '../../types';
import { Default } from '../../utils/constant';
import { isFn } from '../../utils/propValidator';
import RMO from '../RMO';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

interface IActiveModal {
	content: React.ReactNode;
	props: IModalProps;
}

export function createContainerObserver(id: Id, containerProps: IModalContainerProps) {
	let modalCount = 0;
	let activeModals: Id[] = [];
	let snapshot: IModal[] = [];
	let props = containerProps;

	const modals = new Map<Id, IModal>();
	const listeners = new Set<Notify>();

	const observe = (notify: Notify) => {
		listeners.add(notify);
		return () => listeners.delete(notify);
	};

	const notify = () => {
		snapshot = Array.from(modals.values());
		listeners.forEach((cb) => cb());
	};

	const shouldIgnoreModal = ({ containerId, modalId }: INotValidatedModalProps) => {
		const containerMismatch = containerId ? containerId !== id : id !== Default.CONTAINER_ID;
		const isDuplicate = modals.has(modalId);

		return containerMismatch || isDuplicate;
	};

	const popModal = () => {
		activeModals = activeModals.slice(0, -1);
		notify();
	};

	const addActiveModal = async (modal: IActiveModal) => {
		const { modalId, onOpen } = modal.props;

		modals.set(modalId, modal);
		activeModals.push(modalId);

		notify();

		if (isFn(onOpen)) {
			onOpen();
		}
	};

	const buildModal = (content: React.ReactNode, options: INotValidatedModalProps, sequenceNumber: number) => {
		if (shouldIgnoreModal(options)) {
			return;
		}

		const { modalId } = options;

		const closeModal = () => {
			RMO.pop();
		};

		modalCount++;

		const modalProps = {
			...props,
			...options,
			sequenceNumber,
			modalId,
			closeModal,
			deleteModal() {
				const modalToRemove = modals.get(modalId)!;
				const { onClose } = modalToRemove.props;

				if (isFn(onClose)) {
					onClose();
				}

				modals.delete(modalId);

				modalCount--;

				if (modalCount < 0) {
					modalCount = 0;
				}

				notify();
			}
		} as IModalProps;

		const activeModal: IActiveModal = {
			content,
			props: modalProps
		};

		addActiveModal(activeModal);
	};

	return {
		id,
		props,
		observe,
		popModal,
		get modalCount() {
			return modalCount;
		},
		buildModal,
		setProps(p: IModalContainerProps) {
			props = p;
		},
		isModalActive: (id: Id) => activeModals.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
