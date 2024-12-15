import { genModalId } from '../core/Modal/genModalId';
import { buildModal, popModal, pushModal } from '../core/Modal/store';
import { IModalOptions, INotValidatedModalProps, ModalContent } from '../core/Modal/types';
import RmoStack from '../core/RmoStack';
import { Id } from '../types';
import { isId } from '../utils/propValidator';

/**
 * Generate a modalId or use the one provided
 */
function getModalId(options?: IModalOptions) {
	return options && isId(options.modalId) ? options.modalId : genModalId();
}

/**
 * Merge provided options with the defaults settings and generate the modalId
 */
function mergeOptions(options?: IModalOptions) {
	return {
		...options,
		modalId: getModalId(options)
	} as INotValidatedModalProps;
}

/**
 * open new modal overlay
 * @returns modalId. If the container is not mounted or modal is duplicate returns `null`
 * @example
 * const modalId = await pushModal("content");
 */
export default async function (content: ModalContent, options?: IModalOptions): Promise<Id | null> {
	try {
		const mergedOptions = mergeOptions(options);
		const modal = buildModal(content, mergedOptions);

		await RmoStack.push({ id: mergedOptions.modalId, onPopState: () => popModal(options?.containerId) });

		pushModal(modal);

		return mergedOptions.modalId;
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(error);
		}

		return null;
	}
}
