import { useLightboxContainer } from '../../hooks/Lightbox/useLightboxContainer';
import { ILightboxContainerProps } from '../../types';
import enhancedMerge from '../../utils/enhancedMerge';

import Lightbox from './Lightbox';

interface LightboxContainerProps {
	defaultOptions?: ILightboxContainerProps;
}

export const defaultProps: LightboxContainerProps = {
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

export default function LightboxContainer(props: LightboxContainerProps) {
	const { defaultOptions } = enhancedMerge(defaultProps, props);

	const { isLightboxActive, lightboxList } = useLightboxContainer(defaultOptions!);

	return lightboxList.map((props) => {
		return (
			<Lightbox
				{...props}
				show={isLightboxActive(props.lightboxId, props.containerId)}
				key={`alert-${props.containerId}-${props.lightboxId}`}
			/>
		);
	});
}
