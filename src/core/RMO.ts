import { Mutex } from 'async-mutex';
import { isEqual } from 'lodash';

import { Id } from '../types';
import { Default } from '../utils/constant';
import { isNum, isStr } from '../utils/propValidator';

import { genAlertDialogId } from './AlertDialog/genAlertDialogId';
import { popAlertDialog, pushAlertDialog } from './AlertDialog/store';
import { IAlertDialogOptions, INotValidatedAlertDialogProps } from './AlertDialog/types';
import { genBottomSheetId } from './BottomSheet/genBottomSheetId';
import { popBottomSheet, pushBottomSheet } from './BottomSheet/store';
import { BottomSheetContent, IBottomSheetOptions, INotValidatedBottomSheetProps } from './BottomSheet/types';
import { genLightboxId } from './Lightbox/genLightboxId';
import { popLightbox, pushLightbox } from './Lightbox/store';
import { ILightboxOptions, INotValidatedLightboxProps } from './Lightbox/types';
import { genModalId } from './Modal/genModalId';
import { popModal, pushModal } from './Modal/store';
import { IModalOptions, INotValidatedModalProps, ModalContent } from './Modal/types';

type StackItemType =
	| { type: 'modal'; containerId: Id; modalId: Id }
	| { type: 'alertDialog'; containerId: Id; alertDialogId: Id }
	| { type: 'lightbox'; containerId: Id; lightboxId: Id }
	| { type: 'bottomSheet'; containerId: Id; bottomSheetId: Id };

const mutex = new Mutex();

const stack: Array<StackItemType> = [];

function popOverlay(stackItem: StackItemType) {
	if (stackItem.type === 'modal') {
		popModal(stackItem.containerId);
	} else if (stackItem.type === 'alertDialog') {
		popAlertDialog(stackItem.containerId);
	} else if (stackItem.type === 'lightbox') {
		popLightbox(stackItem.containerId);
	} else if (stackItem.type === 'bottomSheet') {
		popBottomSheet(stackItem.containerId);
	}
}

async function popHistoryState(count: number = 1) {
	return new Promise<void>((resolve) => {
		function onPopState(e: PopStateEvent) {
			const stackLength = (e.state?.rmoStackLength as number | null) || 0;

			if (!stackLength || stackLength === stack.length) {
				window.removeEventListener('popstate', onPopState);
				resolve();
			}
		}

		window.addEventListener('popstate', onPopState);

		window.history.go(-count);
	});
}

async function multiplePop(startIndex: number) {
	const items = stack.splice(startIndex);

	if (items.length > 0) {
		items.forEach(popOverlay);

		await popHistoryState(items.length);
	}
}

export function popRMOStackState(params: StackItemType) {
	return mutex.runExclusive(async () => {
		const lastItem = stack.at(-1);

		if (lastItem) {
			if (isEqual(lastItem, params)) {
				stack.pop();
				await popHistoryState();
			}
		}
	});
}

/**
 * Generate a modalId or use the one provided
 */
function getModalId(options?: IModalOptions) {
	return options && (isStr(options.modalId) || isNum(options.modalId)) ? options.modalId : genModalId();
}

/**
 * Merge provided options with the defaults settings and generate the modalId
 */
function mergeModalOptions(sequenceNumber: number, options?: IModalOptions) {
	return {
		...options,
		modalId: getModalId(options),
		sequenceNumber
	} as INotValidatedModalProps;
}

/**
 * open new modal overlay
 * @returns modal is pushed. If the container is not mounted or modal is duplicate returns `false`
 * @example
 * const pushed = await RMO.pushModal("content");
 */
function _pushModal(content: ModalContent, options?: IModalOptions): Promise<boolean> {
	return mutex.runExclusive(() => {
		const mergedOptions = mergeModalOptions(stack.length, options);
		const pushed = pushModal(content, mergedOptions);

		if (pushed) {
			stack.push({
				type: 'modal',
				containerId: options?.containerId || Default.CONTAINER_ID,
				modalId: mergedOptions.modalId
			});

			window.history.pushState(
				{
					...window.history.state,
					rmoStackLength: stack.length
				},
				''
			);
		}

		return pushed;
	});
}

/**
 * Generate a alertDialogId or use the one provided
 */
function getAlertDialogId(options?: IAlertDialogOptions) {
	return options && (isStr(options.alertDialogId) || isNum(options.alertDialogId))
		? options.alertDialogId
		: genAlertDialogId();
}

/**
 * Merge provided options with the defaults settings and generate the alertDialogId
 */
function mergeAlertDialogOptions(sequenceNumber: number, options?: IAlertDialogOptions) {
	return {
		...options,
		alertDialogId: getAlertDialogId(options),
		sequenceNumber
	} as INotValidatedAlertDialogProps;
}

/**
 * open new alert dialog overlay
 * @returns alert dialog is pushed. If the container is not mounted or modal is duplicate returns `false`
 * @example
 * const pushed = await RMO.pushAlertDialog({title: "dialog title", content: "dialog content"});
 */
function _pushAlertDialog(options?: IAlertDialogOptions): Promise<boolean> {
	return mutex.runExclusive(() => {
		const mergedOptions = mergeAlertDialogOptions(stack.length, options);
		const pushed = pushAlertDialog(mergedOptions);

		if (pushed) {
			stack.push({
				type: 'alertDialog',
				containerId: options?.containerId || Default.CONTAINER_ID,
				alertDialogId: mergedOptions.alertDialogId
			});

			window.history.pushState(
				{
					...window.history.state,
					rmoStackLength: stack.length
				},
				''
			);
		}

		return pushed;
	});
}

/**
 * Generate a lightboxId or use the one provided
 */
function getLightboxId(options?: ILightboxOptions) {
	return options && (isStr(options.lightboxId) || isNum(options.lightboxId)) ? options.lightboxId : genLightboxId();
}

/**
 * Merge provided options with the defaults settings and generate the alertDialogId
 */
function mergeLightboxOptions(sequenceNumber: number, options?: ILightboxOptions) {
	return {
		...options,
		lightboxId: getLightboxId(options),
		sequenceNumber
	} as INotValidatedLightboxProps;
}

/**
 * open new lightbox overlay
 * @returns lightbox is pushed. If the container is not mounted or modal is duplicate returns `false`
 * @example
 * const pushed = await RMO.pushLightbox({});
 */
function _pushLightbox(options?: ILightboxOptions): Promise<boolean> {
	return mutex.runExclusive(() => {
		const mergedOptions = mergeLightboxOptions(stack.length, options);
		const pushed = pushLightbox(mergedOptions);

		if (pushed) {
			stack.push({
				type: 'lightbox',
				containerId: options?.containerId || Default.CONTAINER_ID,
				lightboxId: mergedOptions.lightboxId
			});

			window.history.pushState(
				{
					...window.history.state,
					rmoStackLength: stack.length
				},
				''
			);
		}

		return pushed;
	});
}

/**
 * Generate a modalId or use the one provided
 */
function getBottomSheetId(options?: IBottomSheetOptions) {
	return options && (isStr(options.bottomSheetId) || isNum(options.bottomSheetId))
		? options.bottomSheetId
		: genBottomSheetId();
}

/**
 * Merge provided options with the defaults settings and generate the modalId
 */
function mergeBottomSheetOptions(sequenceNumber: number, options?: IBottomSheetOptions) {
	return {
		...options,
		bottomSheetId: getBottomSheetId(options),
		sequenceNumber
	} as INotValidatedBottomSheetProps;
}

/**
 * open new bottom sheet overlay
 * @returns bottom sheet is pushed. If the container is not mounted or bottom sheet is duplicate returns `false`
 * @example
 * const pushed = await RMO.pushBottomSheet("content");
 */
function _pushBottomSheet(content: BottomSheetContent, options?: IBottomSheetOptions): Promise<boolean> {
	return mutex.runExclusive(() => {
		const mergedOptions = mergeBottomSheetOptions(stack.length, options);
		const pushed = pushBottomSheet(content, mergedOptions);

		if (pushed) {
			stack.push({
				type: 'bottomSheet',
				containerId: options?.containerId || Default.CONTAINER_ID,
				bottomSheetId: mergedOptions.bottomSheetId
			});

			window.history.pushState(
				{
					...window.history.state,
					rmoStackLength: stack.length
				},
				''
			);
		}

		return pushed;
	});
}

/**
 * Remove(close) overlays programmatically
 *
 * - Remove the last active overlay:
 * ```
 * RMO.pop()
 * ```
 *
 * - Remove the last two active overlays:
 * ```
 * RMO.pop(2)
 */
function pop(count: number = 1) {
	return mutex.runExclusive(() => multiplePop(-Math.abs(count)));
}

/**
 * remove(close) all active overlays
 */
function popAll() {
	return mutex.runExclusive(() => multiplePop(0));
}

if (typeof window !== 'undefined') {
	const _stackLength = window.history.state?.rmoStackLength as number | null;

	if (typeof _stackLength === 'number' && _stackLength > 0) {
		window.history.go(-_stackLength);
	}

	window.addEventListener('popstate', (e: PopStateEvent) => {
		if (!mutex.isLocked()) {
			const stackLength = (e.state?.rmoStackLength as number | null) || 0;

			if (stackLength < stack.length) {
				mutex.runExclusive(() => {
					const item = stack.pop();

					if (item) {
						popOverlay(item);
					}
				});
			}
		}
	});
}

const RMO = {
	pushModal: _pushModal,
	pushAlertDialog: _pushAlertDialog,
	pushLightbox: _pushLightbox,
	pushBottomSheet: _pushBottomSheet,
	pop,
	popAll
};

export default RMO;
