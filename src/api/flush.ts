import RmoStack from '../core/RmoStack';

/**
 * remove(close) all active overlays
 */
export default function flush() {
	return RmoStack.flush();
}
