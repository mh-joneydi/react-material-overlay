import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';

import { IModalProps } from '../../types';

const Modal = ({ children, show, deleteModal, closeModal, title, sequenceNumber }: IModalProps) => {
	return (
		<Dialog
			onTransitionExited={deleteModal}
			open={show}
			onClose={closeModal}
			sx={(theme) => ({
				zIndex: theme.zIndex.modal + sequenceNumber
			})}
		>
			<StyledIconButton onClick={closeModal} />
			{title && <DialogTitle>{title}</DialogTitle>}
			<DialogContent>
				<React.Suspense fallback="loading...">{children}</React.Suspense>
			</DialogContent>
		</Dialog>
	);
};

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	position: 'absolute',
	top: theme.spacing(1),
	right: theme.spacing(1)
}));

export default Modal;
