import { genBottomSheetId } from '../core/BottomSheet/genBottomSheetId';
import { buildBottomSheet, popBottomSheet, pushBottomSheet } from '../core/BottomSheet/store';
import { BottomSheetContent, IBottomSheetOptions, INotValidatedBottomSheetProps } from '../core/BottomSheet/types';
import RmoStack from '../core/RmoStack';
import { Id } from '../types';
import { isId } from '../utils/propValidator';

/**
 * Generate a bottomSheetId or use the one provided
 */
function getBottomSheetId(options?: IBottomSheetOptions) {
	return options && isId(options.bottomSheetId) ? options.bottomSheetId : genBottomSheetId();
}

/**
 * Merge provided options with the defaults settings and generate the bottomSheetId
 */
function mergeOptions(options?: IBottomSheetOptions) {
	return {
		...options,
		bottomSheetId: getBottomSheetId(options)
	} as INotValidatedBottomSheetProps;
}

/**
 * open new bottom sheet overlay
 * @returns bottomSheetId. If the container is not mounted or bottom sheet is duplicate returns `null`
 * @example
 * const bottomSheetId = await pushBottomSheet("content");
 */
export default async function (content: BottomSheetContent, options?: IBottomSheetOptions): Promise<Id | null> {
	try {
		const mergedOptions = mergeOptions(options);
		const bottomSheet = buildBottomSheet(content, mergedOptions);

		await RmoStack.push({ id: mergedOptions.bottomSheetId, onPopState: () => popBottomSheet(options?.containerId) });

		pushBottomSheet(bottomSheet);

		return mergedOptions.bottomSheetId;
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(error);
		}

		return null;
	}
}
