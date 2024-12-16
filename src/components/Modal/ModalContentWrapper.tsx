import { Box } from '@mui/material';

import { IModalContentWrapperProps } from '../../core';
import { isFn } from '../../utils';

function ModalContentWrapper({ children, contentWrapperProps, scroll }: IModalContentWrapperProps) {
	return (
		<Box
			padding={2}
			paddingTop={0}
			{...(contentWrapperProps ?? {})}
			sx={(theme) => ({
				overflow: scroll === 'paper' ? 'auto' : undefined,
				...(isFn(contentWrapperProps?.sx)
					? (contentWrapperProps.sx as Function)(theme)
					: (contentWrapperProps?.sx ?? {}))
			})}
		>
			{children}
		</Box>
	);
}

export default ModalContentWrapper;
