import React from 'react';

import RmoStack from '../core/RmoStack';
import { Id } from '../types';

/**
 * Handles Escape for the top stack item before it reaches an overlay.
 * `onEscape` closes that overlay. Without it, the key is swallowed.
 */
export default function useBlockEscapeKey(id: Id, enabled: boolean, onEscape?: () => void) {
	const onEscapeRef = React.useRef(onEscape);

	onEscapeRef.current = onEscape;

	React.useEffect(() => {
		if (!enabled) {
			return undefined;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') {
				return;
			}

			if (RmoStack.findIndexById(id) !== RmoStack.length - 1) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			onEscapeRef.current?.();
		};

		window.addEventListener('keydown', handleKeyDown, true);

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [enabled, id]);
}
