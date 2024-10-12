import { Box, Typography } from '@mui/material';

const SuspenseFallback = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minWidth: 275,
				aspectRatio: 16 / 8,
				width: '100%',
				height: '100%',
				alignSelf: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '24px'
			}}
		>
			<Typography
				marginBottom="8px"
				color="text.secondary"
			>
				Loading
			</Typography>
			<Box
				sx={{
					'@-webkit-keyframes fuse-bouncedelay': {
						'0%, 80%, 100%': {
							WebkitTransform: 'scale(0)'
						},
						'40%': {
							WebkitTransform: 'scale(1.0)'
						}
					},

					'@keyframes fuse-bouncedelay': {
						'0%, 80%, 100%': {
							WebkitTransform: 'scale(0)',
							transform: 'scale(0)'
						},
						'40%': {
							WebkitTransform: 'scale(1.0)',
							transform: 'scale(1.0)'
						}
					},
					'& > div': {
						backgroundColor: 'primary.main',
						margin: '4px',
						width: 8,
						height: 8,
						borderRadius: '100%',
						display: 'inline-block',
						WebkitAnimation: 'fuse-bouncedelay 1s infinite ease-in-out both',
						animation: 'fuse-bouncedelay 1s infinite ease-in-out both',
						'&.bounce1': {
							WebkitAnimationDelay: '-0.32s',
							animationDelay: '-0.32s'
						},

						'&.bounce2': {
							WebkitAnimationDelay: '-0.16s',
							animationDelay: '-0.16s'
						}
					}
				}}
			>
				<Box className="bounce1" />
				<Box className="bounce2" />
				<Box className="bounce3" />
			</Box>
		</Box>
	);
};

export default SuspenseFallback;
