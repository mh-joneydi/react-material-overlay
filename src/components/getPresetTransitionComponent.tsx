import React from 'react';
import { Collapse, Fade, Grow, Slide, Zoom } from '@mui/material';

export type transitionPreset = 'zoom' | 'fade' | 'grow' | 'slide' | 'collapse';

const getPresetTransitionComponent = (transitionPreset: transitionPreset) =>
	React.forwardRef(function TransitionComponent(props: any, ref) {
		let PresetTransitionComponent;

		if (transitionPreset === 'slide') {
			PresetTransitionComponent = Slide;
		} else if (transitionPreset === 'zoom') {
			PresetTransitionComponent = Zoom;
		} else if (transitionPreset === 'grow') {
			PresetTransitionComponent = Grow;
		} else if (transitionPreset === 'collapse') {
			PresetTransitionComponent = Collapse;
		} else {
			PresetTransitionComponent = Fade;
		}

		return (
			<PresetTransitionComponent
				{...props}
				ref={ref}
			/>
		);
	});

export default getPresetTransitionComponent;
