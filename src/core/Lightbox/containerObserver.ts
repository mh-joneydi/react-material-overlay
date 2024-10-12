import clsx from 'clsx';
import { merge } from 'lodash';

import type { Id, Notify } from '../../types';
import { Default } from '../../utils/constant';
import enhancedMerge from '../../utils/enhancedMerge';
import { isFn } from '../../utils/propValidator';
import { popRMOStackState } from '../RMO';

import { ILightboxContainerProps, ILightboxProps, INotValidatedLightboxProps } from './types';

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(id: Id, containerProps: ILightboxContainerProps) {
	let lightboxCount = 0;
	let activeLightboxes: Id[] = [];
	let snapshot: ILightboxProps[] = [];
	let props = containerProps;

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

	const shouldIgnore = ({ containerId, lightboxId }: INotValidatedLightboxProps) => {
		const containerMismatch = containerId ? containerId !== id : id !== Default.CONTAINER_ID;
		const isDuplicate = lightboxed.has(lightboxId);

		return containerMismatch || isDuplicate;
	};

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

	const buildLightbox = (options: INotValidatedLightboxProps): boolean => {
		if (shouldIgnore(options)) {
			return false;
		}

		const { lightboxId } = options;

		const closeLightbox = async () => {
			popLightbox();
			await popRMOStackState({ type: 'lightbox', containerId: id, lightboxId });
		};

		lightboxCount++;

		const { className: defaultClassName, styles: defaultStyles, ...containerProps } = props;

		const { className, styles, ...lightboxOptions } = options;

		const lightboxProps = {
			...enhancedMerge(
				containerProps,
				Object.fromEntries(Object.entries(lightboxOptions).filter(([, v]) => v != null))
			),
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

		pushLightbox(lightboxProps);

		return true;
	};

	return {
		id,
		props,
		observe,
		popLightbox,
		get alertDialogCount() {
			return lightboxCount;
		},
		buildLightbox,
		setProps(p: ILightboxContainerProps) {
			props = p;
		},
		isLightboxActive: (id: Id) => activeLightboxes.some((v) => v === id),
		getSnapshot: () => snapshot
	};
}
