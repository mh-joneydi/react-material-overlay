import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme } from '@mui/material';
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

import { RmoStack } from '../../core';
import { ILightboxProps } from '../../core/Lightbox/types';
import { isFn } from '../../utils/propValidator';

const Lightbox = ({
	show,
	closeLightbox,
	deleteLightbox,
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
	extraPlugins,
	rmoStackId
}: ILightboxProps) => {
	const sequenceNumber = React.useRef(RmoStack.findIndexById(rmoStackId)).current;

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
		<>
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
				close={closeLightbox}
				styles={merge(
					{},
					{
						root: {
							'--yarl__portal_zindex': theme.zIndex.modal + sequenceNumber,
							'--yarl__counter_left': theme.direction === 'ltr' ? 0 : 'unset',
							'--yarl__counter_right': theme.direction === 'rtl' ? 0 : 'unset',
							'--yarl__counter_top': captions ? '48px' : 0
						}
					},
					_styles
				)}
				on={{
					...(on ?? {}),
					exited() {
						deleteLightbox();
						on?.exited?.();
					}
				}}
			/>
		</>
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
