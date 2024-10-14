import { buildLightbox, popLightbox, pushLightbox } from '../core/Lightbox/store';
import { ILightboxOptions, INotValidatedLightboxProps } from '../core/Lightbox/types';
import RmoStack from '../core/RmoStack';
import { genRmoStackId } from '../core/RmoStack/genRmoStackId';
import { Id } from '../types';

/**
 * Merge provided options with the defaults settings and generate the lightboxId
 */
function mergeOptions(options?: ILightboxOptions) {
	return {
		...options,
		lightboxId: 'singleton',
		rmoStackId: genRmoStackId()
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

		await RmoStack.push({ id: mergedOptions.rmoStackId, onPopState: () => popLightbox(options?.containerId) });

		pushLightbox(lightbox);

		return mergedOptions.lightboxId;
	} catch (error) {
		console.error(error);
		return null;
	}
}
