import { Mutex } from 'async-mutex';

import { Id } from '../../types';
import { isId, isNum } from '../../utils/propValidator';

import { genRmoStackId } from './genRmoStackId';

const listeners = new Map<Id, () => void>();
const stack: Id[] = [];
const mutex = new Mutex();

export interface PushOptions {
	/**
	 * Optional identifier for the item being pushed.
	 */
	id?: Id;
	/**
	 * listen to event that triggered when the item is popped.
	 */
	onPopState: () => void;
}

export interface SinglePopOptions {
	/**
	 * If true, prevents triggering the event when the item is popped.
	 */
	preventEventTriggering?: boolean;
	/**
	 * Optional identifier to match the item that should be popped.
	 */
	id?: Id;
}

/**
 * Pops multiple items from the stack.
 * @param {number} count - The number of items to pop from the stack.
 * @param {boolean} [preventEventTriggering=false] - If true, prevents triggering events for each item.
 * @private
 */
async function popMultiple(count: number, preventEventTriggering = false): Promise<void> {
	const items = stack.splice(-Math.abs(count));

	if (items.length === 0) {
		return;
	}

	items.forEach((id) => triggerListener(id, preventEventTriggering));
	await popHistoryState(items.length);
}

/**
 * Pops a single item from the stack based on the provided options.
 * @param {SinglePopOptions} [options] - Options to specify which item to pop and whether to trigger events.
 * @private
 */
async function popSingle(options?: SinglePopOptions): Promise<void> {
	const lastItemId = stack.at(-1);

	if (!lastItemId || (options?.id && options.id !== lastItemId)) {
		return;
	}

	stack.pop();

	triggerListener(lastItemId, options?.preventEventTriggering);
	await popHistoryState();
}

/**
 * Triggers the listener for a given id and removes it from the listeners map.
 * @param {Id} id - The id whose listener needs to be triggered.
 * @param {boolean} [preventEventTriggering=false] - If true, prevents triggering the event.
 * @private
 */
function triggerListener(id: Id, preventEventTriggering = false): void {
	if (!preventEventTriggering) {
		listeners.get(id)?.();
	}

	listeners.delete(id);
}

/**
 * Updates the browser's history state based on the current length of the stack.
 * @private
 */
function updateHistoryState(): void {
	window.history.pushState(
		{
			...window.history.state,
			rmoStackLength: stack.length
		},
		''
	);
}

/**
 * Adjusts the browser's history state by navigating back a certain number of steps.
 * @param {number} [count=1] - The number of steps to move back in the browser's history.
 * @returns {Promise<void>} - A promise that resolves when the state change is complete.
 * @private
 */
async function popHistoryState(count = 1): Promise<void> {
	return new Promise<void>((resolve) => {
		function onPopState(e: PopStateEvent) {
			const stackLength = (e.state?.rmoStackLength as number | null) || 0;

			if (stackLength === stack.length) {
				window.removeEventListener('popstate', onPopState);
				resolve();
			}
		}

		window.addEventListener('popstate', onPopState);
		window.history.go(-count);
	});
}

/**
 * Initializes the stack based on the current browser history state and sets up event listeners.
 * @private
 */
function initialize(): void {
	const _stackLength = window.history.state?.rmoStackLength as number | null;

	if (isNum(_stackLength) && _stackLength > 0) {
		window.history.go(-_stackLength);
	}

	window.addEventListener('popstate', (e: PopStateEvent) => {
		if (mutex.isLocked()) {
			return;
		}

		const stackLength = (e.state?.rmoStackLength as number | null) || 0;

		if (stackLength < stack.length) {
			mutex.runExclusive(() => {
				const id = stack.pop();

				if (id) {
					triggerListener(id);
				}
			});
		}
	});
}

// Initialize the stack and set up history event listeners if running in a browser environment.
if (typeof window !== 'undefined') {
	initialize();
}

/**
 * Stack management object with methods for pushing, popping, flushing, and querying the stack.
 */
const RmoStack = {
	/**
	 * Pushes a new item onto the stack, sets an event listener, and updates the history state.
	 * @param {PushOptions} options - containing the optional `id` and a `listiner` that invoked when the item is popped.
	 * @returns {Promise<{ id: Id; index: number }>} - A promise that resolves with the id and index of the pushed item.
	 */
	async push(options: PushOptions): Promise<{ id: Id; index: number }> {
		return mutex.runExclusive(() => {
			const id = options.id && isId(options.id) ? options.id : genRmoStackId();

			if (stack.some((value) => value === id)) {
				throw new Error(`The push request is duplicate with id: ${id}. \n Each push must be made with a unique id.`);
			}

			stack.push(id);
			listeners.set(id, options.onPopState);

			updateHistoryState();
			return { id, index: stack.length - 1 };
		});
	},

	pop: ((params?: number | SinglePopOptions, preventEventTriggering?: boolean): Promise<void> => {
		return mutex.runExclusive(async () => {
			if (isNum(params)) {
				if (params < 2) {
					console.warn('for multiple pops, count must be at least 2, otherwise use pop without count parameter.');
				}

				// Pop multiple items
				await popMultiple(params, preventEventTriggering);
			} else {
				// Pop a single item
				await popSingle(params);
			}
		});
	}) as {
		/**
		 * Pops item from the stack.
		 * @param {SinglePopOptions} [params] - options for pop.
		 * @returns {Promise<void>} - A promise that resolves when the pop operation is complete.
		 */
		(params?: SinglePopOptions): Promise<void>;
		/**
		 * Pops items from the stack.
		 * @param {number} [count] - The number of items to pop.
		 * @param {boolean} [preventEventTriggering] - If true, prevents triggering the associated events.
		 * @returns {Promise<void>} - A promise that resolves when the pop operation is complete.
		 */
		(count?: number, preventEventTriggering?: boolean): Promise<void>;
	},

	/**
	 * Flushes all items from the stack, optionally triggering events for each item.
	 * @param {boolean} [preventEventTriggering=false] - If `true`, prevents triggering events for each flushed item.
	 * @returns {Promise<void>} - A promise that resolves when all items are flushed.
	 */
	async flush(preventEventTriggering = false): Promise<void> {
		return mutex.runExclusive(async () => {
			const items = stack.splice(0);

			if (items.length === 0) {
				return;
			}

			items.forEach((id) => triggerListener(id, preventEventTriggering));
			await popHistoryState(items.length);
		});
	},

	/**
	 * Finds the index of an item in the stack by its id.
	 * @param {Id} id - The id of the item to search for in the stack.
	 * @returns {number} - The index of the item in the stack, or -1 if not found.
	 */
	findIndexById(id: Id): number {
		return stack.indexOf(id);
	},

	/**
	 * The current length of the stack.
	 * @returns {number}
	 */
	get length(): number {
		return stack.length;
	}
};

export default RmoStack;
