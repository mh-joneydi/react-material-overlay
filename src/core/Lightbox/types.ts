import 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/plugins/share';
import 'yet-another-react-lightbox/plugins/slideshow';
import 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/plugins/zoom';

import { Theme } from '@mui/material';
import {
	CaptionsRef,
	ControllerRef,
	FullscreenRef,
	LightboxProps,
	SlideshowRef,
	ThumbnailsRef,
	ZoomRef
} from 'yet-another-react-lightbox';

import { Id } from '../../types';

export type LightboxControllerRef = ControllerRef;
export type LightboxZoomRef = ZoomRef;
export type LightboxCaptionsRef = CaptionsRef;
export type LightboxSlideshowRef = SlideshowRef;
export type LightboxThumbnailsRef = ThumbnailsRef;
export type LightboxFullscreenRef = FullscreenRef;

export interface ILightboxCommonOptions {
	/** lifecycle callbacks */
	on?: LightboxProps['on'];
	/** custom render functions */
	render?: LightboxProps['render'];
	/** custom UI labels / translations */
	labels?: LightboxProps['labels'];
	/** toolbar settings */
	toolbarOptions?: LightboxProps['toolbar'];
	/** carousel settings */
	carouselOptions?: LightboxProps['carousel'];
	/** animation settings */
	animationOptions?: LightboxProps['animation'];
	/** controller settings */
	controllerOptions?: LightboxProps['controller'];
	/** NoScroll module settings */
	noScrollOptions?: LightboxProps['noScroll'];
	/**
	 * customization styles
	 *
	 * The styles that are defined in the container are merged with the styles that you define when pushing new lightbox
	 */
	styles?: LightboxProps['styles'] | ((theme: Theme) => LightboxProps['styles']);
	/**
	 * if `true`, [`Captions plugin`]('https://yet-another-react-lightbox.com/plugins/captions') will be used
	 * @default true
	 */
	captions?: boolean;
	/**
	 * [`Captions plugin`]('https://yet-another-react-lightbox.com/plugins/captions') settings
	 */
	captionsOptions?: LightboxProps['captions'];
	/**
	 * if `true`, [`Counter plugin`]('https://yet-another-react-lightbox.com/plugins/counter') will be used
	 * @default false
	 */
	counter?: boolean;
	/**
	 * [`Counter plugin`]('https://yet-another-react-lightbox.com/plugins/counter') settings
	 */
	counterOptions?: LightboxProps['counter'];
	/**
	 * if `true`, [`Download plugin`]('https://yet-another-react-lightbox.com/plugins/download') will be used
	 * @default false
	 */
	download?: boolean;
	/**
	 * [`Download plugin`]('https://yet-another-react-lightbox.com/plugins/download') settings
	 */
	downloadOptions?: LightboxProps['download'];
	/**
	 * if `true`, [`Fullscreen plugin`]('https://yet-another-react-lightbox.com/plugins/fullscreen') will be used
	 * @default true
	 */
	fullscreen?: boolean;
	/**
	 * [`Fullscreen plugin`]('https://yet-another-react-lightbox.com/plugins/fullscreen') settings
	 */
	fullscreenOptions?: LightboxProps['fullscreen'];
	/**
	 * if `true`, [`Share plugin`]('https://yet-another-react-lightbox.com/plugins/share') will be used
	 * @default false
	 */
	share?: boolean;
	/**
	 * [`Share plugin`]('https://yet-another-react-lightbox.com/plugins/share') settings
	 */
	shareOptions?: LightboxProps['share'];
	/**
	 * if `true`, [`Slideshow plugin`]('https://yet-another-react-lightbox.com/plugins/slideshow') will be used
	 * 	@default false
	 */
	slideshow?: boolean;
	/**
	 * [`Slideshow plugin`]('https://yet-another-react-lightbox.com/plugins/slideshow') settings
	 */
	slideshowOptions?: LightboxProps['slideshow'];
	/**
	 * if `true`, [`Thumbnails plugin`]('https://yet-another-react-lightbox.com/plugins/thumbnails') will be used.
	 * @default true
	 */
	thumbnails?: boolean;
	/**
	 * [`Thumbnails plugin`]('https://yet-another-react-lightbox.com/plugins/thumbnails') settings
	 */
	thumbnailsOptions?: LightboxProps['thumbnails'];
	/**
	 * [`Video plugin`]('https://yet-another-react-lightbox.com/plugins/video') settings
	 * - The video plugin is used by default
	 */
	videoOptions?: LightboxProps['video'];
	/**
	 * if `true`, [`Zoom plugin`]('https://yet-another-react-lightbox.com/plugins/zoom') will be used.
	 * @default true
	 */
	zoom?: boolean;
	/**
	 * [`Zoom plugin`]('https://yet-another-react-lightbox.com/plugins/zoom') settings
	 */
	zoomOptions?: LightboxProps['zoom'];
	/**
	 * add extra plugins
	 */
	extraPlugins?: LightboxProps['plugins'];
}

export interface ILightboxDefaultOptions extends ILightboxCommonOptions {
	/** CSS class of the lightbox root element */
	className?: LightboxProps['className'];
}

export interface ILightboxContainerProps {
	/**
	 * Set id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * set default options for lightbox
	 */
	defaultOptions: ILightboxDefaultOptions;
}

export interface ILightboxOptions extends ILightboxCommonOptions {
	/** slides to display in the lightbox */
	slides: LightboxProps['slides'];
	/**
	 * container id to handle multiple container
	 */
	containerId?: Id;
	/**
	 * Set a custom `lightboxId` for prevent duplicating
	 */
	lightboxId?: Id;
	/**
	 * Called when lightbox is mounted.
	 */
	onOpen?: () => void;
	/**
	 * Called when lightbox is unmounted.
	 */
	onClose?: () => void;
	/**
	 * Override or extend the styles applied to the component.
	 *
	 * - Auto merge with default className that defined in Container:
	 * ```
	 * {
	 *   className: "some-class"
	 * }
	 * ```
	 *
	 * -  Manual merge or overwrite default className that defined in Container
	 * ```
	 * {
	 *   className: (defaultClassName)=> "overwrited-clsss"
	 * }
	 * ```
	 */
	className?:
		| ((defaultClassName: LightboxProps['className']) => LightboxProps['className'])
		| LightboxProps['className'];
}

export interface ILightboxProps extends ILightboxOptions {
	lightboxId: Id;
	containerId: Id;
	show: boolean;
	closeLightbox: () => Promise<void>;
	deleteLightbox: () => void;
	className?: LightboxProps['className'];
}

export interface INotValidatedLightboxProps extends Partial<ILightboxProps> {
	lightboxId: Id;
}
