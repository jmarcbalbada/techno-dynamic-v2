import { useState } from 'react';
import { Button, Paper, TextField } from '@mui/material';
import './ContentSlide.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const ContentSlide = ({ index, deleteContent, ...props }) => {
	const [isUrlClicked, setIsUrlClicked] = useState(false);

	const urlClickHandler = () => {
		setIsUrlClicked(true);
	};

	const deleteContentHandler = () => {
		deleteContent(index);
	};

	const onUrlChange = (e) => {
		if (props.onUrlChange) {
			props.onUrlChange(index, e.target.value);
		}
	};

	const onTextChange = (e) => {
		if (props.onTextChange) {
			props.onTextChange(index, e.target.value);
		}
	};

	return (
		<Paper
			elevation={16}
			className="content-title-paper"
			sx={{
				position: 'relative',
				backgroundColor: '#f5f5f5',
				marginTop: '2rem',
				borderRadius: '10px',
			}}
		>
			<Button
				onClick={() => {
					deleteContentHandler();
				}}
				variant="text"
				color="error"
				sx={{
					position: 'absolute',
					top: '2rem',
					right: '2rem',
				}}
			>
				<DeleteForeverIcon />
			</Button>
			<div className="content-page-title-input">
				<span>Content:</span>
				<TextField
					onChange={onTextChange}
					required
          autoComplete="off"
					size="small"
					margin="dense"
					multiline
					minRows={10}
					maxRows={15}
					sx={{
						width: '70%',
						marginBottom: '1rem',
					}}
				></TextField>
				<div className="content-attach-buttons">
					{isUrlClicked ? (
						<TextField
							onChange={onUrlChange}
              required
              autoComplete="off"
							size="small"
							label="URL"
							fullWidth
							sx={{}}
						></TextField>
					) : (
						<Button
							onClick={urlClickHandler}
							variant="contained"
							sx={{
								backgroundColor: '#3F3F3F',
							}}
						>
							Add Url
						</Button>
					)}
					<Button
						variant="contained"
						sx={{
							backgroundColor: '#3F3F3F',
						}}
					>
						Add Files
					</Button>
				</div>
				<span className="content-slide-counter">Page {index + 1}</span>
			</div>
		</Paper>
	);
};
