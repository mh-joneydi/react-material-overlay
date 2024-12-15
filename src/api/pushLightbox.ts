import { buildLightbox, popLightbox, pushLightbox } from '../core/Lightbox/store';
import { ILightboxOptions, INotValidatedLightboxProps } from '../core/Lightbox/types';
import RmoStack from '../core/RmoStack';
import { Id } from '../types';
import { isId } from '../utils';

/**
 * Generate a lightboxId or use the one provided
 */
function getLightboxId(options?: ILightboxOptions) {
	return options && isId(options.lightboxId) ? options.lightboxId : 'lightbox-overlay';
}

/**
 * Merge provided options with the defaults settings and generate the lightboxId
 */
function mergeOptions(options?: ILightboxOptions) {
	return {
		...options,
		lightboxId: getLightboxId(options)
	} as INotValidatedLightboxProps;
}

/**
 * open new lightbox overlay
 * @returns lightboxId. If the container is not mounted or modal is duplicate returns `null`
 * @example
 * const lightboxId = await pushLightbox({slides: [...]});
 */
export default async function (options?: ILightboxOptions): Promise<Id | null> {
	try {
		const mergedOptions = mergeOptions(options);
		const lightbox = buildLightbox(mergedOptions);

		await RmoStack.push({ id: mergedOptions.lightboxId, onPopState: () => popLightbox(options?.containerId) });

		pushLightbox(lightbox);

		return mergedOptions.lightboxId;
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(error);
		}

		return null;
	}
}
