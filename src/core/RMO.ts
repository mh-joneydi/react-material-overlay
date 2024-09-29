import { Mutex } from 'async-mutex';

import { Id, IModalOptions } from '../types';
import { Default, Events } from '../utils/constant';
import EventEmitter from '../utils/EventEmitter';

type StackItemType = {
	type: 'modal';
	containerId: Id;
};

const mutex = new Mutex();

const stack: Array<StackItemType> = [];

function emitPopEventHandler(stackItem: StackItemType) {
	if (stackItem.type === 'modal') {
		EventEmitter.emit(Events.PopModal, { containerId: stackItem.containerId });
	}
}

async function multiplePop(items: Array<StackItemType>) {
	if (items.length > 0) {
		items.forEach(emitPopEventHandler);

		await new Promise<void>((resolve) => {
			function onPopState(e: PopStateEvent) {
				const stackLength = (e.state?.rmoStackLength as number | null) || 0;

				if (!stackLength || stackLength === stack.length) {
					window.removeEventListener('popstate', onPopState);
					resolve();
				}
			}

			window.addEventListener('popstate', onPopState);

			window.history.go(-items.length);
		});
	}
}

/**
 * open new modal overlay
 */
async function pushModal(content: React.ReactNode, options?: IModalOptions) {
	await mutex.runExclusive(() => {
		EventEmitter.emit(Events.PushModal, { content, options, sequenceNumber: stack.length });

		stack.push({ type: 'modal', containerId: options?.containerId || Default.CONTAINER_ID });

		window.history.pushState(
			{
				...window.history.state,
				rmoStackLength: stack.length
			},
			''
		);
	});
}

/**
 * Remove overlays programmatically
 *
 * - remove the last overlay:
 * ```
 * RMO.pop()
 * ```
 *
 * - Remove the last two overlays:
 * ```
 * RMO.pop(2)
 */
async function pop(count: number = 1) {
	await mutex.runExclusive(async () => {
		const items = stack.splice(-count);

		await multiplePop(items);
	});
}

/**
 * remove all overlays
 */
async function popAll() {
	await mutex.runExclusive(async () => {
		const items = stack.splice(0);

		await multiplePop(items);
	});
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
						emitPopEventHandler(item);
					}
				});
			}
		}
	});
}

const RMO = {
	pushModal,
	pop,
	popAll
};

export default RMO;
