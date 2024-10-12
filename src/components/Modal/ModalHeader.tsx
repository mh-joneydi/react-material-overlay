import React from 'react';
import { CardHeader } from '@mui/material';

import { IModalProps } from '../../core/Modal/types';

export type ModalHeaderProps = Pick<
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

export default function ModalHeader({ title, subheader, closeButton, headerProps }: ModalHeaderProps) {
	return (
		<CardHeader
			{...(headerProps ?? {})}
			title={title}
			subheader={subheader}
			action={closeButton}
		/>
	);
}
