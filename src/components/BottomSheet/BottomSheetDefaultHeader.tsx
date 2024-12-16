import { CardHeader } from '@mui/material';

import { IBottomSheetHeaderProps } from '../../core';
import { isFn } from '../../utils';

export default function BottomSheetDefaultHeader({
	closeButton,
	headerProps,
	title,
	subheader
}: IBottomSheetHeaderProps) {
	return (
		<CardHeader
			{...(headerProps ?? {})}
			sx={(theme) => ({
				padding: 0,
				textAlign: 'left',
				...(isFn(headerProps?.sx) ? (headerProps.sx as Function)(theme) : (headerProps?.sx ?? {}))
			})}
			title={title}
			subheader={subheader}
			action={closeButton}
		/>
	);
}
