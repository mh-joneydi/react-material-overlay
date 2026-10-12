import { PopInterceptor } from '../types';

import { isFn } from './propValidator';

/**
 * `false` keeps the overlay open. A thrown error keeps it open as well.
 * A returned promise is left for the caller so history can move before it is awaited.
 */
export function readPopInterceptor(interceptor?: PopInterceptor): boolean | Promise<boolean> {
	if (!isFn(interceptor)) {
		return true;
	}

	try {
		const result = interceptor();

		if (result instanceof Promise) {
			return result.then(
				(value) => value !== false,
				(error: unknown) => {
					console.error(error);

					return false;
				}
			);
		}

		return result !== false;
	} catch (error) {
		console.error(error);

		return false;
	}
}

export default async function allowsClose(interceptor?: PopInterceptor): Promise<boolean> {
	return readPopInterceptor(interceptor);
}
