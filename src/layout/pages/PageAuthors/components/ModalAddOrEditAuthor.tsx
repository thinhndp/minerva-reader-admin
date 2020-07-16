import React, { useState, FunctionComponent } from 'react';
import * as authorAPI from '../../../../api/authorAPI';
import { Author, AuthorInput } from '../../../../interfaces/author';
import { useFormik } from 'formik';
import { Modal, Form, InputGroup } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import UploadButton from '../../../components/UploadButton';
import * as FileUtils from '../../../../utils/FileUtils';

interface IDialogAddOrEditAuthorProps {
	authorToEdit: Author | null, // null: DialogAdd. not null: DialogEdit
	isOpen: boolean,
	onClose: Function, // Call this to close Dialog
	onSave: Function, // Call this to close Dialog & refresh table
}

const ModalAddOrEditAuthor: FunctionComponent<IDialogAddOrEditAuthorProps> = (props) => {
	const [isLoadingSave, setIsLoadingSave] = useState(false);
	const [authorPhoto, setAuthorPhoto] = useState<any>();

	const validate = (values: AuthorInput) => {
		const errors: any = {};
		if (!values.name) {
			errors.name = "Required";
		}
		return errors;
	}

	const onSaveSuccessful = () => {
		setIsLoadingSave(false);
		setAuthorPhoto(null);
		props.onSave();
	}

	const onSubmit = () => {
		const { values, errors, resetForm } = formik;
		console.log('submit');
		console.log(errors);
		let noError: boolean = true;
		noError = noError && errors.name ? false : true;
		console.log(noError);
		if (!noError) {
			// Shake animation on invalid fields
			const f: any = document.getElementsByClassName("invalid-feedback");
			for (let elem of f) {
				console.log('shake');
				elem.classList.remove("shake-animation");
				void elem.offsetWidth;
				elem.classList.add("shake-animation");
			}
		}
		else {
			// Submit
			setIsLoadingSave(true);
			if (authorPhoto) {
				FileUtils.uploadFilePromise('AuthorPhotos', authorPhoto, values.name)
					.then((photoUrl: any) => {
						console.log(photoUrl);
						const authorInput = { ...values, PhotoURL: photoUrl };
						callAPI(authorInput)
					})
					.catch(error => {
						setIsLoadingSave(false);
						console.log(error);
					})
			}
			else {
				const authorInput = { ...values };
				callAPI(authorInput);
			}
		}
	}

	const callAPI = (authorInput: AuthorInput) => {
		if (!props.authorToEdit) {
			authorAPI.addAuthor(authorInput)
				.then(response => {
					console.log(response);
					onSaveSuccessful();
				})
				.catch(error => {
					setIsLoadingSave(false);
					console.log(error);
				})
		}
		else {
			authorAPI.updateAuthor(props.authorToEdit.id, authorInput)
				.then(response => {
					console.log(response);
					onSaveSuccessful();
				})
				.catch(error => {
					setIsLoadingSave(false);
					console.log(error);
				})
		}
	}

	const onModalEnter = () => {
		formik.resetForm()
	}

	const onModalClose = () => {
		setAuthorPhoto(null);
		props.onClose();
	}

	const handleChoosingImage = (e: any) => {
		console.log(e.target.files);
		if (e.target.files[0]) {
			const image = e.target.files[0];
			setAuthorPhoto(image);
		}
	};

	const formik = useFormik({
		initialValues: props.authorToEdit
				? { ...props.authorToEdit }
				: {
					name: '',
					about: '',
					PhotoURL: '',
				},
		validate,
		enableReinitialize: true,
		onSubmit: values => {
			console.log(values);
		}
	})
	return (
		<Modal show={props.isOpen} onHide={() => onModalClose()} centered onEnter={() => onModalEnter()}>
			<Modal.Header closeButton>
				<Modal.Title>{!props.authorToEdit ? `Add Author` : `Edit Author: ${props.authorToEdit.name}`}</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: "12px 50px" }}>
				<Form>
					<Form.Group>
						<Form.Label>Author Name</Form.Label>
						<Form.Control
							id="authorName"
							name="name"
							placeholder="Input author name"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.name}
							isValid={
								formik.touched.name && !formik.errors.name
							}
							isInvalid={
								formik.touched.name && formik.errors.name != null
							}
						/>
						<Form.Control.Feedback
							type="invalid"
							className="feedback"
						>
							{formik.errors.name}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group>
						<Form.Label>About Author</Form.Label>
						<Form.Control
							id="authorAbout"
							name="about"
							placeholder="Input author bio"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.about}
						/>
					</Form.Group>
					{/* <Form.Group>
						<Form.Label>Photo URL</Form.Label>
						<Form.Control
							id="authorPhotoURL"
							name="PhotoURL"
							placeholder="www.google.com"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.PhotoURL}
						/>
					</Form.Group> */}
					<Form.Group>
						<Form.Label>Photo</Form.Label>
						<InputGroup>
							<Form.Control
								placeholder="Images Path"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={(authorPhoto != null && authorPhoto.name != null) ? authorPhoto.name : '' }
							/>
							<InputGroup.Append>
								<UploadButton
									accept="image/*"
									onChange={handleChoosingImage}
								>
									...
								</UploadButton>
							</InputGroup.Append>
						</InputGroup>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					// color="primary"
					onClick={() => onModalClose()}
				>
					Cancel
				</Button>
				<div style={{position: 'relative'}}>
					<Button
						color="primary"
						variant="contained"
						onClick={(e: any) => {
							onSubmit();
							formik.handleSubmit(e);
						}}
						disabled={isLoadingSave}
					>
						Save
					</Button>
					{isLoadingSave && <CircularProgress size={24} className="circular-center-size-24px" />}
				</div>
			</Modal.Footer>
		</Modal>
	);
}
export default ModalAddOrEditAuthor;