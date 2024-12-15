import { CardHeader } from '@mui/material';

import { BottomSheetHeaderProps } from '../../core/BottomSheet/types';
import { isFn } from '../../utils';

export default function BottomSheetDefaultHeader({ bottomSheetProps, closeButton }: BottomSheetHeaderProps) {
	return (
		<CardHeader
			{...(bottomSheetProps.headerProps ?? {})}
			sx={(theme) => ({
				padding: 0,
				textAlign: 'left',
				...(isFn(bottomSheetProps.headerProps?.sx)
					? (bottomSheetProps.headerProps.sx as Function)(theme)
					: (bottomSheetProps.headerProps?.sx ?? {}))
			})}
			title={bottomSheetProps.title}
			subheader={bottomSheetProps.subheader}
			action={closeButton}
		/>
	);
}
