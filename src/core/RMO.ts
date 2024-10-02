import { Mutex } from 'async-mutex';
import { isEqual } from 'lodash';

import { Id, IModalOptions, INotValidatedModalProps } from '../types';
import { Default } from '../utils/constant';
import { isNum, isStr } from '../utils/propValidator';

import { genModalId } from './Modal/genModalId';
import { popModal, pushModal } from './Modal/store';

type StackItemType = {
	type: 'modal';
	containerId: Id;
	modalId: Id;
};

const mutex = new Mutex();

const stack: Array<StackItemType> = [];

function popOverlay(stackItem: StackItemType) {
	if (stackItem.type === 'modal') {
		popModal(stackItem.containerId);
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
	mutex.runExclusive(async () => {
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
function _pushModal(content: React.ReactNode, options?: IModalOptions): Promise<boolean> {
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
	return mutex.runExclusive(() => multiplePop(-count));
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
	pop,
	popAll
};

export default RMO;
