import RmoStack from '../core/RmoStack';

/**
 * remove(close) all active overlays
 */
export default function () {
	return RmoStack.flush();
}
