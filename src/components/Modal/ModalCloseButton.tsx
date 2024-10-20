import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';

export interface IModalCloseButtonProps {
	closeHandler: () => void;
	icon: React.ReactNode;
	closeButtonProps?: Omit<IconButtonProps, 'onClick'>;
}

export default function ModalCloseButton({ closeHandler, icon, closeButtonProps }: IModalCloseButtonProps) {
	return (
		<IconButton
			aria-label="close"
			{...(closeButtonProps ?? {})}
			onClick={(e) => {
				e.stopPropagation();
				closeHandler();
			}}
		>
			{icon || (
				<svg
					stroke="currentColor"
					fill="none"
					strokeWidth="2"
					viewBox="0 0 24 24"
					aria-hidden="true"
					height="1em"
					width="1em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			)}
		</IconButton>
	);
}
