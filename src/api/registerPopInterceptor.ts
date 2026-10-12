import RmoStack from '../core/RmoStack';
import { Id, PopInterceptor } from '../types';

/**
 * Registers a pop interceptor for a stack id.
 * Return `false`, or a promise that resolves to `false`, to cancel that pop.
 * The returned function removes this interceptor only.
 *
 * The id is the same one passed to `pushModal`, `pushAlertDialog`, `pushBottomSheet`, or `pushLightbox`.
 */
export default function registerPopInterceptor(id: Id, interceptor: PopInterceptor): () => void {
	return RmoStack.subscribePopInterceptor(id, interceptor);
}
