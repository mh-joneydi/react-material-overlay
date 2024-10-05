import React from 'react';
import { CardHeader } from '@mui/material';

import { IModalProps } from '../../types';

export type HeaderProps = Pick<
	IModalProps,
	| 'title'
	| 'subheader'
	| 'headerProps'
	| 'fullScreen'
	| 'scroll'
	| 'maxWidth'
	| 'transitionPreset'
	| 'transitionProps'
	| 'closeModal'
> & {
	closeButton?: React.ReactNode;
};

export default function ModalHeader({ title, subheader, closeButton, headerProps }: HeaderProps) {
	return (
		<CardHeader
			{...(headerProps ?? {})}
			title={title}
			subheader={subheader}
			action={closeButton}
		/>
	);
}
