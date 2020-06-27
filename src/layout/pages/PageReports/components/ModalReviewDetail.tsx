import React, { useState, FunctionComponent } from 'react';
import * as reviewAPI from '../../../../api/reviewAPI';
// import { Genre, GenreInput } from '../../../../interfaces/genre';
import { Review } from '../../../../interfaces/review';
import { Book } from '../../../../interfaces/book';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Modal, Form } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IModalReviewDetailProps {
	review: Review,
	isOpen: boolean,
	onClose: Function,
}

const ModalReviewDetail: FunctionComponent<IModalReviewDetailProps> = (props) => {
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const [isEnableDelete, setIsEnableDelete] = useState(false);
	let history = useHistory();

	const onModalEnter = () => {
		formik.resetForm();
	}

	const onModalClose = () => {
		props.onClose();
	}

	const formik = useFormik({
		initialValues: props.review
				? { ...props.review }
				: {
					id: '',
					update: '',
					comment: '',
					bookId: '',
					username: '',
					rating: 0,
					upvotes: [],
					reports: [],
					upvoteCount: 0,
					reportCount: 0,
				},
		enableReinitialize: true,
		onSubmit: () => {}
	})

	const onDelete = () => {
		setIsLoadingDelete(true);
		reviewAPI.deleteReview(props.review.id)
			.then((response) => {
				setIsLoadingDelete(false);
				history.push('/reviews');
			})
			.catch((error) => {
				setIsLoadingDelete(false);
				console.log(error);
			})
	}

	const onCheckChange = (event: any) => {
		// console.log(event);
		// console.log(event.value);
		setIsEnableDelete(!isEnableDelete);
	}

	return (
		<Modal show={props.isOpen} onHide={() => onModalClose()} centered onEnter={() => onModalEnter()}>
			<Modal.Header closeButton>
				<Modal.Title>Review Detail</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: "12px 50px" }}>
				<Form>
					<Form.Group>
						<Form.Label>User</Form.Label>
						<Form.Control
							id="username"
							name="username"
							value={formik.values.username}
							disabled={true}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Comment</Form.Label>
						<Form.Control
							id="comment"
							name="comment"
							value={formik.values.comment}
							disabled={true}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Rating</Form.Label>
						<Form.Control
							id="rating"
							name="rating"
							value={formik.values.rating}
							disabled={true}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Upvote Count</Form.Label>
						<Form.Control
							id="upvoteCount"
							name="upvoteCount"
							value={formik.values.upvoteCount}
							disabled={true}
						/>
					</Form.Group>
					<Form.Group controlId="formBasicCheckbox">
						<Form.Check
							checked={isEnableDelete}
							type="checkbox"
							label="Enable Delete"
							onChange={(e: any) => onCheckChange(e)}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() => onModalClose()}
				>
					Cancel
				</Button>
				<div style={{position: 'relative'}}>
					<Button
						color="secondary"
						variant="contained"
						onClick={(e: any) => {
							onDelete();
						}}
						disabled={isLoadingDelete || !isEnableDelete}
					>
						Delete
					</Button>
					{isLoadingDelete && <CircularProgress size={24} className="circular-center-size-24px" />}
				</div>
			</Modal.Footer>
		</Modal>
	);
}
export default ModalReviewDetail;