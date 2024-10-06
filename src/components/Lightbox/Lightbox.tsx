import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider, css, Global } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';
import { merge } from 'lodash';
import { ControllerRef, default as YetAnotherReactLightbox } from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import yarlCaptionsPluginStyles from 'yet-another-react-lightbox/plugins/captions.css';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import yarlCounterPluginStyles from 'yet-another-react-lightbox/plugins/counter.css';
import Download from 'yet-another-react-lightbox/plugins/download';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Share from 'yet-another-react-lightbox/plugins/share';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import yarlThumbnailsPluginStyles from 'yet-another-react-lightbox/plugins/thumbnails.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import yarlStyles from 'yet-another-react-lightbox/styles.css';

import { ILightboxProps } from '../../types';
import { isFn } from '../../utils/propValidator';

const yarlStylesCache = createCache({ key: 'yarl', prepend: true });

const Lightbox = ({
	show,
	closeLightbox,
	deleteLightbox,
	sequenceNumber,
	captions,
	counter,
	download,
	fullscreen,
	share,
	slideshow,
	thumbnails,
	zoom,
	fullscreenOptions,
	captionsOptions,
	counterOptions,
	downloadOptions,
	shareOptions,
	slideshowOptions,
	thumbnailsOptions,
	videoOptions,
	zoomOptions,
	carouselOptions,
	controllerOptions,
	labels,
	noScrollOptions,
	toolbarOptions,
	styles,
	render,
	className,
	animationOptions,
	on,
	slides,
	extraPlugins
}: ILightboxProps) => {
	const theme = useTheme();
	const plugins = React.useMemo(
		() =>
			getPlugins({
				captions,
				counter,
				download,
				fullscreen,
				share,
				slideshow,
				thumbnails,
				zoom,
				extraPlugins
			}),
		[captions, counter, download, fullscreen, share, slideshow, thumbnails, zoom, extraPlugins]
	);
	const controllerRef = React.useRef<ControllerRef>(null);

	const _styles = isFn(styles) ? styles(theme) : (styles ?? {});

	React.useLayoutEffect(() => {
		if (show === false) {
			(controllerOptions?.ref as unknown as React.RefObject<ControllerRef>)?.current?.close();
			controllerRef.current?.close();
		}
	}, [controllerOptions?.ref, show]);

	return (
		<CacheProvider value={yarlStylesCache}>
			<Global styles={css(yarlStyles as string)} />
			<Global
				styles={{
					':root': {
						'--yarl__slide_captions_container_background': theme.palette.background.default,
						'--yarl__slide_description_color': theme.palette.text.primary,
						'--yarl__slide_title_color': theme.palette.text.primary,
						'--yarl__thumbnails_thumbnail_active_border_color': theme.palette.primary.main,
						'--yarl__thumbnails_thumbnail_border': '1px',
						'--yarl__thumbnails_thumbnail_background': theme.palette.background.default,
						'--yarl__thumbnails_thumbnail_border_color': theme.palette.divider,
						'--yarl__thumbnails_thumbnail_border_radius': `${theme.shape.borderRadius}px`,
						'--yarl__color_button': theme.palette.text.primary,
						'--yarl__color_button_active': theme.palette.primary.main,
						'--yarl__color_button_disabled': theme.palette.text.disabled,
						'--yarl__color_backdrop': theme.palette.background.default,
						'--yarl__icon_size': '28px',
						'--yarl__counter_top': captions ? '48px' : '0px',
						'--yarl__button_filter': `drop-shadow(2px 2px 8px ${alpha(theme.palette.background.default, 0.5)})`,
						'--yarl__counter_filter': `drop-shadow(2px 2px 8px ${alpha(theme.palette.background.default, 0.5)})`
					}
				}}
			/>
			{captions ? <Global styles={css(yarlCaptionsPluginStyles as string)} /> : null}
			{counter ? <Global styles={css(yarlCounterPluginStyles as string)} /> : null}
			{thumbnails ? <Global styles={css(yarlThumbnailsPluginStyles as string)} /> : null}

			<YetAnotherReactLightbox
				slides={slides}
				animation={animationOptions}
				className={className}
				render={render}
				toolbar={toolbarOptions}
				labels={labels}
				carousel={carouselOptions}
				fullscreen={fullscreenOptions}
				noScroll={noScrollOptions}
				captions={captionsOptions}
				counter={counterOptions}
				download={downloadOptions}
				share={shareOptions}
				slideshow={slideshowOptions}
				thumbnails={thumbnailsOptions}
				video={videoOptions}
				zoom={zoomOptions}
				open
				controller={{ ref: controllerRef, ...(controllerOptions ?? {}) }}
				plugins={plugins}
				close={() => closeLightbox()}
				styles={merge({}, _styles, {
					root: {
						'--yarl__portal_zindex': theme.zIndex.modal + sequenceNumber
					}
				})}
				on={{
					...(on ?? {}),
					exited() {
						deleteLightbox();
						on?.exited?.();
					}
				}}
			/>
		</CacheProvider>
	);
};

const getPlugins = ({
	captions,
	counter,
	download,
	fullscreen,
	share,
	slideshow,
	thumbnails,
	zoom,
	extraPlugins
}: Pick<
	ILightboxProps,
	'captions' | 'counter' | 'download' | 'fullscreen' | 'share' | 'slideshow' | 'thumbnails' | 'zoom' | 'extraPlugins'
>) => {
	let plugins = [Video];

	if (captions) {
		plugins.push(Captions);
	}

	if (counter) {
		plugins.push(Counter);
	}

	if (download) {
		plugins.push(Download);
	}

	if (fullscreen) {
		plugins.push(Fullscreen);
	}

	if (share) {
		plugins.push(Share);
	}

	if (slideshow) {
		plugins.push(Slideshow);
	}

	if (thumbnails) {
		plugins.push(Thumbnails);
	}

	if (zoom) {
		plugins.push(Zoom);
	}

	if (extraPlugins && Array.isArray(extraPlugins) && extraPlugins.length > 0) {
		plugins = plugins.concat(extraPlugins);
	}

	return plugins;
};

export default Lightbox;
