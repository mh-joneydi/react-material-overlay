import clsx from 'clsx';
import { isNull, merge, omitBy } from 'lodash';

import type { Id, Notify } from '../../types';
import enhancedMerge from '../../utils/enhancedMerge';
import { isFn } from '../../utils/propValidator';
import RmoStack from '../RmoStack';

import { ILightboxDefaultOptions, ILightboxProps, INotValidatedLightboxProps } from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(id: Id, containerDefaultOptions: ILightboxDefaultOptions) {
	let lightboxCount = 0;
	let activeLightboxes: Id[] = [];
	let snapshot: ILightboxProps[] = [];
	let defaultOptions = containerDefaultOptions;

	const lightboxed = new Map<Id, ILightboxProps>();
	const listeners = new Set<Notify>();

	const observe = (notify: Notify) => {
		listeners.add(notify);
		return () => listeners.delete(notify);
	};

	const notify = () => {
		snapshot = Array.from(lightboxed.values());
		listeners.forEach((cb) => cb());
	};

	function shouldIgnorePop(lightboxId: Id) {
		const lastActiveId = activeLightboxes.at(-1);
		return lastActiveId !== lightboxId;
	}

	const popLightbox = () => {
		activeLightboxes = activeLightboxes.slice(0, -1);
		notify();
	};

	const pushLightbox = async (lightbox: ILightboxProps) => {
		const { lightboxId, onOpen } = lightbox;

		lightboxed.set(lightboxId, lightbox);
		activeLightboxes = [...activeLightboxes, lightboxId];

		notify();

		if (isFn(onOpen)) {
			onOpen();
		}
	};

	const buildLightbox = (options: INotValidatedLightboxProps) => {
		if (lightboxed.has(options.lightboxId)) {
			throw new Error('lightbox is already opened!');
		}

		const { lightboxId } = options;

		const closeLightbox = async () => {
			if (shouldIgnorePop(lightboxId)) {
				return;
			}

			popLightbox();
			await RmoStack.pop({ id: lightboxId, preventEventTriggering: true });
		};

		lightboxCount++;

		const { className: defaultClassName, styles: defaultStyles, ...containerProps } = defaultOptions;

		const { className, styles, ...lightboxOptions } = options;

		const lightboxProps = {
			...enhancedMerge(containerProps, omitBy(lightboxOptions, isNull)),
			lightboxId,
			containerId: id,
			closeLightbox,
			deleteLightbox() {
				const lightboxToRemove = lightboxed.get(lightboxId)!;
				const { onClose } = lightboxToRemove;

				if (isFn(onClose)) {
					onClose();
				}

				lightboxed.delete(lightboxId);

				lightboxCount--;

				if (lightboxCount < 0) {
					lightboxCount = 0;
				}

				notify();
			}
		} as ILightboxProps;

		if (isFn(className)) {
			lightboxProps.className = className(defaultClassName);
		} else if (defaultClassName && className) {
			lightboxProps.className = clsx(defaultClassName, className);
		} else if (defaultClassName) {
			lightboxProps.className = defaultClassName;
		} else {
			lightboxProps.className = className;
		}

		if (defaultStyles && styles) {
			lightboxProps.styles = (theme) => {
				return merge(
					{},
					isFn(defaultStyles) ? defaultStyles(theme) : defaultStyles,
					isFn(styles) ? styles(theme) : styles
				);
			};
		} else {
			lightboxProps.styles = styles || defaultStyles;
		}

		return lightboxProps;
	};

	return {
		id,
		defaultOptions,
		observe,
		pushLightbox,
		popLightbox,
		get alertDialogCount() {
			return lightboxCount;
		},
		buildLightbox,
		setDefaultOptions(d: ILightboxDefaultOptions) {
			defaultOptions = d;
		},
		isLightboxActive: (id: Id) => activeLightboxes.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
