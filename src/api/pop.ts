import RmoStack from '../core/RmoStack';
import { Id } from '../types';

interface PopParams {
	/**
	 * Id check to prevent multiple pop call accidently
	 */
	id: Id;
}

/**
 * Remove(close) overlays programmatically
 *
 * - Remove the last active overlay:
 * ```
 * pop()
 * ```
 *
 * - Remove the last two active overlays:
 * ```
 * pop(2)
 * ```
 *
 * - Remove the last active overlay with Id check to prevent multiple pop call accidently:
 * ```
 * pushModal('someContent', { modalId: 'my-modal-id' });
 * .
 * .
 * .
 * pop({ id:'my-modal-id' });
 * ```
 */
export default function pop(param?: number | PopParams) {
	return RmoStack.pop(param as number);
}
