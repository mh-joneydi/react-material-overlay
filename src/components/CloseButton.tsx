import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';

export interface ICloseButtonProps {
	closeHandler: () => void;
	icon: React.ReactNode;
	closeButtonProps?: Omit<IconButtonProps, 'onClick'>;
}

export default function CloseButton({ closeHandler, icon, closeButtonProps }: ICloseButtonProps) {
	return (
		<IconButton
			aria-label="close"
			{...(closeButtonProps ?? {})}
			onClick={(e) => {
				e.stopPropagation();
				closeHandler();
			}}
		>
			{icon}
		</IconButton>
	);
}
