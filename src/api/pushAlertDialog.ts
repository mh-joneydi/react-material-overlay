import { genAlertDialogId } from '../core/AlertDialog/genAlertDialogId';
import { buildAlertDialog, popAlertDialog, pushAlertDialog } from '../core/AlertDialog/store';
import { IAlertDialogOptions, INotValidatedAlertDialogProps } from '../core/AlertDialog/types';
import RmoStack from '../core/RmoStack';
import { Id } from '../types';
import { isId } from '../utils/propValidator';

/**
 * Generate a alertDialogId or use the one provided
 */
function getAlertDialogId(options?: IAlertDialogOptions) {
	return options && isId(options.alertDialogId) ? options.alertDialogId : genAlertDialogId();
}

/**
 * Merge provided options with the defaults settings and generate the alertDialogId
 */
function mergeOptions(options?: IAlertDialogOptions) {
	return {
		...options,
		alertDialogId: getAlertDialogId(options)
	} as INotValidatedAlertDialogProps;
}

/**
 * open new alert dialog overlay
 * @returns alertDialogId. If the container is not mounted or alertDialog is duplicate returns `null`
 * @example
 * const alertDialogId = await pushAlertDialog({title: "dialog title", content: "dialog content"});
 */
export default async function (options?: IAlertDialogOptions): Promise<Id | null> {
	try {
		const mergedOptions = mergeOptions(options);
		const alertDialog = buildAlertDialog(mergedOptions);

		await RmoStack.push({
			id: mergedOptions.alertDialogId,
			onPopState: () => popAlertDialog(options?.containerId)
		});

		pushAlertDialog(alertDialog);

		return mergedOptions.alertDialogId;
	} catch (error) {
		console.error(error);

		return null;
	}
}
