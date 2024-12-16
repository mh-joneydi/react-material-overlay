import { CardHeader } from '@mui/material';

import { IModalHeaderProps } from '../../core/Modal/types';

export default function ModalHeader({ title, subheader, closeButton, headerProps }: IModalHeaderProps) {
	return (
		<CardHeader
			{...(headerProps ?? {})}
			title={title}
			subheader={subheader}
			action={closeButton}
		/>
	);
}
