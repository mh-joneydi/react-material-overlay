import { Mutex } from 'async-mutex';

import { Id } from '../../types';
import { isId, isNum } from '../../utils/propValidator';

import { genRmoStackId } from './genRmoStackId';

interface StackCallbacks {
	onPopState: () => void;
	onRedoState: () => void;
}

interface RmoHistoryState {
	rmoSession?: string;
	rmoIds?: Id[];
	rmoStackLength?: number;
}

const listeners = new Map<Id, StackCallbacks>();
const stack: Id[] = [];
const mutex = new Mutex();
const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

let historyTraversal = false;

export interface PushOptions {
	/**
	 * Optional identifier for the item being pushed.
	 */
	id?: Id;
	/**
	 * listen to event that triggered when the item is popped.
	 */
	onPopState: () => void;
	/**
	 * Invoked when this history entry is redone by the browser (forward).
	 * Must restore the overlay without pushing a new history entry.
	 */
	onRedoState: () => void;
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
 * Drops callbacks for overlays that are closed and can no longer be redone.
 * Active stack entries stay registered.
 * @private
 */
function discardRedoCallbacks(): void {
	for (const id of [...listeners.keys()]) {
		if (!stack.includes(id)) {
			listeners.delete(id);
		}
	}
}

/**
 * Any scripted `pushState` clears the browser forward list, including navigations outside this stack.
 * @private
 */
function installHistoryPushStateHook(): void {
	const nativePushState = history.pushState.bind(history);

	history.pushState = (data: unknown, unused: string, url?: string | URL | null) => {
		discardRedoCallbacks();
		nativePushState(data, unused, url);
	};
}

/**
 * Reads overlay ids stored on a history entry from this page load.
 * Entries from another load, or entries this stack did not write, restore nothing.
 * @private
 */
function readHistoryIds(state: unknown): Id[] {
	if (!state || typeof state !== 'object') {
		return [];
	}

	const historyState = state as RmoHistoryState;

	if (historyState.rmoSession !== sessionId || !Array.isArray(historyState.rmoIds)) {
		return [];
	}

	const ids: Id[] = [];
	const seen = new Set<Id>();

	for (const id of historyState.rmoIds) {
		if (!isId(id) || seen.has(id)) {
			continue;
		}

		seen.add(id);
		ids.push(id);
	}

	return ids;
}

/**
 * Aligns the in-memory stack with the ids on the destination history entry.
 * Callbacks for closed ids stay registered so a later forward can redo them.
 * @private
 */
function syncStackWithHistory(state: unknown): void {
	const desiredIds = readHistoryIds(state);
	const closingIds = stack.filter((id) => !desiredIds.includes(id)).reverse();
	const reopeningIds = desiredIds.filter((id) => !stack.includes(id) && listeners.has(id));
	const nextIds = desiredIds.filter((id) => stack.includes(id) || listeners.has(id));

	stack.splice(0, stack.length, ...nextIds);

	for (const id of closingIds) {
		listeners.get(id)?.onPopState();
	}

	for (const id of reopeningIds) {
		listeners.get(id)?.onRedoState();
	}
}

/**
 * Rewrites the current history entry when its overlay fields do not match the live stack.
 * `replaceState` leaves the rest of the forward list in place.
 * @private
 */
function alignHistoryEntryWithStack(): void {
	const state = window.history.state as RmoHistoryState | null;
	const hasRmoFields =
		!!state && typeof state === 'object' && ('rmoSession' in state || 'rmoIds' in state || 'rmoStackLength' in state);

	if (!hasRmoFields && stack.length === 0) {
		return;
	}

	const historyIds = Array.isArray(state?.rmoIds) ? state.rmoIds : [];
	const idsMatch = historyIds.length === stack.length && historyIds.every((id, index) => id === stack[index]);

	if (hasRmoFields && state && state.rmoSession === sessionId && state.rmoStackLength === stack.length && idsMatch) {
		return;
	}

	const historyState: RmoHistoryState = {
		...state,
		rmoSession: sessionId,
		rmoIds: stack.slice(),
		rmoStackLength: stack.length
	};

	window.history.replaceState(historyState, '');
}

/**
 * Marks the current history traversal so a following `hashchange` is not treated as a new navigation.
 * @private
 */
function markHistoryTraversal(): void {
	historyTraversal = true;

	window.setTimeout(() => {
		historyTraversal = false;
	}, 0);
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
 * Triggers the pop listener for a given id. The callback stays registered so the entry can be redone.
 * @param {Id} id - The id whose listener needs to be triggered.
 * @param {boolean} [preventEventTriggering=false] - If true, prevents triggering the event.
 * @private
 */
function triggerListener(id: Id, preventEventTriggering = false): void {
	if (!preventEventTriggering) {
		listeners.get(id)?.onPopState();
	}
}

/**
 * Updates the browser's history state based on the current stack.
 * @private
 */
function updateHistoryState(): void {
	const historyState: RmoHistoryState = {
		...window.history.state,
		rmoSession: sessionId,
		rmoIds: stack.slice(),
		rmoStackLength: stack.length
	};

	window.history.pushState(historyState, '');
}

/**
 * Adjusts the browser's history state by navigating back a certain number of steps.
 * @param {number} [count=1] - The number of steps to move back in the browser's history.
 * @returns {Promise<void>} - A promise that resolves when the state change is complete.
 * @private
 */
async function popHistoryState(count = 1): Promise<void> {
	return new Promise<void>((resolve) => {
		function onHistoryPop(e: PopStateEvent) {
			const stackLength = (e.state?.rmoStackLength as number | null) || 0;

			if (stackLength === stack.length) {
				window.removeEventListener('popstate', onHistoryPop);
				resolve();
			}
		}

		window.addEventListener('popstate', onHistoryPop);
		window.history.go(-count);
	});
}

/**
 * Initializes the stack based on the current browser history state and sets up event listeners.
 * @private
 */
function initialize(): void {
	installHistoryPushStateHook();

	window.addEventListener('popstate', (e: PopStateEvent) => {
		markHistoryTraversal();

		if (mutex.isLocked()) {
			return;
		}

		mutex.runExclusive(() => {
			syncStackWithHistory(e.state);
			alignHistoryEntryWithStack();
		});
	});

	window.addEventListener('hashchange', () => {
		if (historyTraversal) {
			return;
		}

		discardRedoCallbacks();
	});

	const _stackLength = window.history.state?.rmoStackLength as number | null;

	if (isNum(_stackLength) && _stackLength > 0) {
		window.history.go(-_stackLength);
	}
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
	 * Pushes a new item onto the stack, sets event listeners, and updates the history state.
	 * @param {PushOptions} options - containing the optional `id`, `onPopState`, and required `onRedoState`.
	 * @returns {Promise<{ id: Id; index: number }>} - A promise that resolves with the id and index of the pushed item.
	 */
	async push(options: PushOptions): Promise<{ id: Id; index: number }> {
		return mutex.runExclusive(() => {
			const id = options.id && isId(options.id) ? options.id : genRmoStackId();

			if (stack.some((value) => value === id)) {
				throw new Error(`The push request is duplicate with id: ${id}. \n Each push must be made with a unique id.`);
			}

			stack.push(id);
			listeners.set(id, { onPopState: options.onPopState, onRedoState: options.onRedoState });

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
