import React, { useState, FunctionComponent } from 'react';
// import * as authorAPI from '../../../../api/authorAPI';
import * as bookAPI from '../../../../api/bookAPI';
import { Book, BookInput } from '../../../../interfaces/book';
import { Author } from '../../../../interfaces/author';
import { Genre } from '../../../../interfaces/genre';
import { useFormik } from 'formik';
import { Modal, Form } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import Chips, { Chip } from 'react-chips'
import styles from './styles.module.scss';

interface IDialogAddOrEditBookProps {
	bookToEdit: Book | null, // null: DialogAdd. not null: DialogEdit
	authorList: Author[],
	genreList: Genre[],
	isOpen: boolean,
	onClose: Function, // Call this to close Dialog
	onSave: Function, // Call this to close Dialog & refresh table
}

const CustomChip = (props: any) => {
	return (
		<div className={styles['custom-chip-container']}>
			{props.children}
			<div
				className={styles['chip-x-icon']}
				onClick={() => props.onRemove(props.index)}
			>&times;</div>
		</div>
	);
}

const ModalAddOrEditBook: FunctionComponent<IDialogAddOrEditBookProps> = (props) => {
	const [isLoadingSave, setIsLoadingSave] = useState(false);
	const [selectedGenres, setSelectedGenres] = useState<Array<Genre>>([]);
	const [selectedAuthors, setSelectedAuthors] = useState<Array<Author>>([]);

	const validate = (values: BookInput) => {
		const errors: any = {};
		if (!values.title) {
			errors.title = "Required";
		}
		return errors;
	}

	const onSaveSuccessful = (resetForm: any) => {
		setIsLoadingSave(false);
		props.onSave();
	}

	const onSubmit = () => {
		const { values, errors, resetForm } = formik;
		let noError: boolean = true;
		noError = noError && errors.title ? false : true;
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
			const requestData = {
				...values,
				categoryIds: [ ...selectedGenres.map((genre: Genre) => genre.id) ],
				authorIds: [ ...selectedAuthors.map((author: Author) => author.id) ]
			}
			if (!props.bookToEdit) {
				// Add Genre
				bookAPI.createBook(requestData)
					.then(response => {
						console.log(response);
						onSaveSuccessful(resetForm);
					})
					.catch(error => {
						setIsLoadingSave(false);
						console.log(error);
					})
			}
			else {
				// Update Genre
				bookAPI.updateBook(props.bookToEdit.id, requestData)
					.then(response => {
						console.log(response);
						onSaveSuccessful(resetForm);
					})
					.catch(error => {
						setIsLoadingSave(false);
						console.log(error);
					})
			}
		}
	}

	const onModalEnter = () => {
		formik.resetForm()
		console.log(props.genreList.map(genre => genre.name));
	}

	const onModalClose = () => {
		props.onClose();
	}

	// const onSelectedGenreChange = (genreNames: string[]) => {
	// 	setSelectedGenreNames(genreNames);
	// 	console.log(selectedGenreNames);
	// }

	const onSelectedGenresChange = (genres: Genre[]) => {
		setSelectedGenres(genres);
		console.log(selectedGenres);
	}

	const onSelectedAuthorsChange = (authors: Author[]) => {
		setSelectedAuthors(authors);
		console.log(selectedAuthors);
	}

	const formik = useFormik({
		initialValues: props.bookToEdit
				? {
					...props.bookToEdit,
					categoryIds: [ ...props.bookToEdit.categories.map(category => category.id) ],
					authorIds: [ ...props.bookToEdit.authors.map(author => author.id) ],
				}
				: {
					releaseAt: '',
					title: '',
					publisher: '',
					image: '',
					description: '',
					categoryIds: [],
					authorIds: [],
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
				<Modal.Title>{!props.bookToEdit ? `Create Book` : `Edit Book: ${props.bookToEdit.title}`}</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: "12px 50px" }}>
				<Form>
					<Form.Group>
						<Form.Label>Book Title</Form.Label>
						<Form.Control
							id="bookTitle"
							name="title"
							placeholder="The Little Prince"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.title}
							isValid={
								formik.touched.title && !formik.errors.title
							}
							isInvalid={
								formik.touched.title && formik.errors.title != null
							}
						/>
						<Form.Control.Feedback
							type="invalid"
							className="feedback"
						>
							{formik.errors.title}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group>
						<Form.Label>Description</Form.Label>
						<Form.Control
							id="bookDescription"
							name="description"
							placeholder="The Little Prince is a novella by French aristocrat, writer, and aviator Antoine de Saint-Exupéry."
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.description}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Book Image URL</Form.Label>
						<Form.Control
							id="bookImageURL"
							name="image"
							placeholder="www.google.com"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.image}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Genres</Form.Label>
						<Chips
							placeholder="Type a genre name"
							value={selectedGenres}
							onChange={onSelectedGenresChange}
							suggestions={props.genreList}
							renderChip={(genre: Genre) => (<CustomChip>{genre.name}</CustomChip>)}
							renderSuggestion={(genre: Genre, p: any) => (
								<div className={styles['suggestion']} key={genre.id}>{genre.name}</div>
							)}
							suggestionsFilter={(opt: any, val: any) => (
								opt.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
							)}
							getSuggestionValue={(genre: Genre) => genre.name}
							fromSuggestionsOnly={true}
							uniqueChips={true}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Authors</Form.Label>
						<Chips
							placeholder="Type an author name"
							value={selectedAuthors}
							onChange={onSelectedAuthorsChange}
							suggestions={props.authorList}
							renderChip={(author: Author) => (<CustomChip>{author.name}</CustomChip>)}
							renderSuggestion={(author: Author, p: any) => (
								<div className={styles['suggestion']} key={author.id}>{author.name}</div>
							)}
							suggestionsFilter={(opt: any, val: any) => (
								opt.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
							)}
							getSuggestionValue={(author: Author) => author.name}
							fromSuggestionsOnly={true}
							uniqueChips={true}
						/>
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
							formik.handleSubmit(e);
							onSubmit();
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
export default ModalAddOrEditBook;