import { css, Global } from '@emotion/react';
import { alpha, GlobalStyles } from '@mui/material';
import yarlStyles from 'yet-another-react-lightbox/styles.css';

import { ILightboxContainerProps } from '../../core/Lightbox/types';
import { useLightboxContainer } from '../../hooks';
import enhancedMerge from '../../utils/enhancedMerge';

import Lightbox from './Lightbox';

export const defaultProps: ILightboxContainerProps = {
	defaultOptions: {
		zoom: true,
		zoomOptions: {
			maxZoomPixelRatio: 20,
			scrollToZoom: true,
			zoomInMultiplier: 2
		},
		fullscreen: true,
		noScrollOptions: { disabled: false },
		captions: true,
		thumbnails: true
	}
};

export default function LightboxContainer(props: Partial<ILightboxContainerProps>) {
	const containerProps = enhancedMerge(defaultProps, props);

	const { isLightboxActive, lightboxList } = useLightboxContainer(containerProps);

	return (
		<>
			<Global styles={css(yarlStyles as string)} />
			<GlobalStyles
				styles={(theme) => ({
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
						'--yarl__button_filter': `drop-shadow(2px 2px 8px ${alpha(theme.palette.background.default, 0.5)})`,
						'--yarl__counter_filter': `drop-shadow(2px 2px 8px ${alpha(theme.palette.background.default, 0.5)})`
					}
				})}
			/>
			{lightboxList.map((props) => {
				return (
					<Lightbox
						{...props}
						show={isLightboxActive(props.lightboxId, props.containerId)}
						key={`lightbox-${props.containerId}-${props.lightboxId}`}
					/>
				);
			})}
		</>
	);
}
