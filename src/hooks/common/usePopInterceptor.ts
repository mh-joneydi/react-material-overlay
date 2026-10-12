import React from 'react';

import registerPopInterceptor from '../../api/registerPopInterceptor';
import { Id, PopInterceptor } from '../../types';

/**
 * Registers a pop interceptor for a stack id while this component is mounted.
 * Pass the same id given to `pushModal`, `pushAlertDialog`, `pushBottomSheet`, or `pushLightbox`.
 * Every registered interceptor must allow the pop.
 */
export default function usePopInterceptor(id: Id | null | undefined, interceptor: PopInterceptor) {
	const interceptorRef = React.useRef(interceptor);

	interceptorRef.current = interceptor;

	React.useEffect(() => {
		if (id === null || id === undefined) {
			return undefined;
		}

		return registerPopInterceptor(id, () => interceptorRef.current());
	}, [id]);
}
