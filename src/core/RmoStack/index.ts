import { Mutex } from 'async-mutex';

import { Id, PopInterceptor } from '../../types';
import { readPopInterceptor } from '../../utils/allowsClose';
import { isFn, isId, isNum } from '../../utils/propValidator';

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
const popInterceptors = new Map<Id, Set<PopInterceptor>>();
const confirming = new Set<Id>();
const stack: Id[] = [];
const mutex = new Mutex();
const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

let historyTraversal = false;
let restoringHistory = false;
let resolveHistoryRestore: (() => void) | null = null;

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
 * Ids that would leave the stack if history landed on `state`, top first.
 * @private
 */
function closingIdsFromState(state: unknown): Id[] {
	const desiredIds = readHistoryIds(state);

	return stack.filter((id) => !desiredIds.includes(id)).reverse();
}

function guardsFor(id: Id): PopInterceptor[] {
	return [...(popInterceptors.get(id) ?? [])];
}

function hasPopInterceptor(id: Id): boolean {
	return guardsFor(id).length > 0;
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
 * Moves forward to the history entry this back navigation left.
 * The following `popstate` is ignored so the in-memory stack stays put.
 * @private
 */
function beginHistoryRestore(steps: number): Promise<void> {
	restoringHistory = true;

	const restored = new Promise<void>((resolve) => {
		resolveHistoryRestore = resolve;
	});

	window.history.go(steps);

	return restored;
}

function finishHistoryRestore(): void {
	restoringHistory = false;
	resolveHistoryRestore?.();
	resolveHistoryRestore = null;
}

/**
 * Runs every guard for one id. A second request while one is in progress does not open another dialog.
 * @private
 */
async function confirmClose(id: Id): Promise<boolean> {
	if (confirming.has(id)) {
		return false;
	}

	const guards = guardsFor(id);

	if (guards.length === 0) {
		return true;
	}

	confirming.add(id);

	try {
		for (const guard of guards) {
			if (!(await readPopInterceptor(guard))) {
				return false;
			}
		}

		return true;
	} finally {
		confirming.delete(id);
	}
}

/**
 * How many ids from the top may close. Stops at the first denial, leaving the rest open.
 * @private
 */
async function countAllowed(ids: Id[]): Promise<number> {
	let allowed = 0;

	for (const id of ids) {
		if (!(await confirmClose(id))) {
			break;
		}

		allowed += 1;
	}

	return allowed;
}

/**
 * Pops the given ids only if they are still the top of the stack, in that order.
 * @private
 */
async function commitPopIds(idsFromTop: Id[], preventEventTriggering = false): Promise<boolean> {
	if (idsFromTop.length === 0) {
		return false;
	}

	return mutex.runExclusive(async () => {
		const top = stack.slice(-idsFromTop.length).reverse();
		const matches = top.length === idsFromTop.length && top.every((id, index) => id === idsFromTop[index]);

		if (!matches) {
			return false;
		}

		const items = stack.splice(-idsFromTop.length);

		items.forEach((id) => triggerListener(id, preventEventTriggering));
		await popHistoryState(items.length);

		return true;
	});
}

async function popAllowed(idsFromTop: Id[], preventEventTriggering = false): Promise<boolean> {
	const allowed = await countAllowed(idsFromTop);

	if (allowed === 0) {
		return false;
	}

	const popped = await commitPopIds(idsFromTop.slice(0, allowed), preventEventTriggering);

	return popped && allowed === idsFromTop.length;
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

function applyHistoryPop(state: unknown): void {
	void mutex.runExclusive(() => {
		syncStackWithHistory(state);
		alignHistoryEntryWithStack();
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

		if (restoringHistory) {
			finishHistoryRestore();

			return;
		}

		const closingIds = closingIdsFromState(e.state);
		const guarded = closingIds.some((id) => hasPopInterceptor(id));

		if (!guarded) {
			applyHistoryPop(e.state);

			return;
		}

		void beginHistoryRestore(closingIds.length).then(async () => {
			const allowed = await countAllowed(closingIds);

			if (allowed > 0) {
				await commitPopIds(closingIds.slice(0, allowed), false);
			}
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

	/**
	 * Registers a pop interceptor. Every interceptor must allow the pop.
	 * The returned function removes this interceptor only.
	 */
	subscribePopInterceptor(id: Id, interceptor: PopInterceptor): () => void {
		if (!isFn(interceptor)) {
			return () => undefined;
		}

		let interceptors = popInterceptors.get(id);

		if (!interceptors) {
			interceptors = new Set();
			popInterceptors.set(id, interceptors);
		}

		interceptors.add(interceptor);

		return () => {
			const current = popInterceptors.get(id);

			current?.delete(interceptor);

			if (current && current.size === 0) {
				popInterceptors.delete(id);
			}
		};
	},

	pop: ((params?: number | SinglePopOptions, preventEventTriggering?: boolean): Promise<boolean> => {
		if (isNum(params)) {
			if (params < 2) {
				console.warn('for multiple pops, count must be at least 2, otherwise use pop without count parameter.');
			}

			const count = Math.min(Math.abs(params), stack.length);
			const idsFromTop = stack.slice(-count).reverse();

			return popAllowed(idsFromTop, preventEventTriggering);
		}

		const options = params;
		const lastItemId = stack.at(-1);

		if (!lastItemId || (options?.id && options.id !== lastItemId)) {
			return Promise.resolve(false);
		}

		return popAllowed([lastItemId], options?.preventEventTriggering);
	}) as {
		/**
		 * Pops item from the stack.
		 * @param {SinglePopOptions} [params] - options for pop.
		 * @returns {Promise<boolean>} - Resolves `true` when the item was popped.
		 */
		(params?: SinglePopOptions): Promise<boolean>;
		/**
		 * Pops items from the stack.
		 * @param {number} [count] - The number of items to pop.
		 * @param {boolean} [preventEventTriggering] - If true, prevents triggering the associated events.
		 * @returns {Promise<boolean>} - Resolves `true` when every requested item was popped.
		 */
		(count?: number, preventEventTriggering?: boolean): Promise<boolean>;
	},

	/**
	 * Flushes items from the top of the stack until a pop interceptor denies one.
	 * @param {boolean} [preventEventTriggering=false] - If `true`, prevents triggering events for each flushed item.
	 * @returns {Promise<void>} - A promise that resolves when the flush attempt is finished.
	 */
	async flush(preventEventTriggering = false): Promise<void> {
		const idsFromTop = [...stack].reverse();

		if (idsFromTop.length === 0) {
			return;
		}

		const allowed = await countAllowed(idsFromTop);

		if (allowed === 0) {
			return;
		}

		await commitPopIds(idsFromTop.slice(0, allowed), preventEventTriggering);
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
