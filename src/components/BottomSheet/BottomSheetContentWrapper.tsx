import { Box } from '@mui/material';

import { IBottomSheetContentWrapperProps } from '../../core';
import { isFn } from '../../utils';

function BottomSheetContentWrapper({ children, contentWrapperProps }: IBottomSheetContentWrapperProps) {
	return (
		<Box
			padding={2}
			{...(contentWrapperProps ?? {})}
			sx={(theme) => ({
				...(isFn(contentWrapperProps?.sx)
					? (contentWrapperProps.sx as Function)(theme)
					: (contentWrapperProps?.sx ?? {}))
			})}
		>
			{children}
		</Box>
	);
}

export default BottomSheetContentWrapper;
