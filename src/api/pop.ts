import RmoStack from '../core/RmoStack';

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
 */
export default function (count: number = 1) {
	return RmoStack.pop(count);
}
