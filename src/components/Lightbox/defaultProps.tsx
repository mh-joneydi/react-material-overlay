import { ILightboxContainerProps } from '../../core';

const defaultProps: ILightboxContainerProps = {
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

export default defaultProps;
