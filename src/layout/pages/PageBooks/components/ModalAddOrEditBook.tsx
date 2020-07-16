import React, { useState, FunctionComponent } from 'react';
// import * as authorAPI from '../../../../api/authorAPI';
import * as bookAPI from '../../../../api/bookAPI';
import { Book, BookInput } from '../../../../interfaces/book';
import { Author } from '../../../../interfaces/author';
import { Genre } from '../../../../interfaces/genre';
import { useFormik } from 'formik';
import { Modal, Form, InputGroup } from "react-bootstrap";
import UploadButton from '../../../components/UploadButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import Chips, { Chip } from 'react-chips'
import styles from './styles.module.scss';
import * as FileUtils from '../../../../utils/FileUtils';
import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import $ from "jquery";

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
	const [bookFile, setBookFile] = useState<any>();
	const [bookImage, setBookImage] = useState<any>();
	const [releasedDate, setReleasedDate] = useState('');

	const validate = (values: BookInput) => {
		const errors: any = {};
		if (!values.title) {
			errors.title = "Required";
		}
		return errors;
	}

	const onSaveSuccessful = () => {
		setIsLoadingSave(false);
		setBookFile(null);
		setBookImage(null);
		setReleasedDate('');
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
			let bookInput = {
				...values,
				categoryIds: [ ...selectedGenres.map((genre: Genre) => genre.id) ],
				authorIds: [ ...selectedAuthors.map((author: Author) => author.id) ],
				releaseAt: releasedDate,
			}
			let uploadPromises: Promise<any>[] = [];
			if (bookFile) {
				uploadPromises.push(FileUtils.uploadFilePromise('BookFiles', bookFile, values.title));
			}
			if (bookImage) {
				uploadPromises.push(FileUtils.uploadFilePromise('BookImages', bookImage, values.title));
			}
			if (uploadPromises.length > 0) {
				Promise.all(uploadPromises)
					.then(responses => {
						// let bookInput: BookInput = { ...values };
						if (bookFile) {
							bookInput.link = responses[0];
							if (bookImage) {
								bookInput.image = responses[1];
							}
						}
						else {
							if (bookImage) {
								bookInput.image = responses[0];
							}
						}
						callAPI(bookInput);
					})
			}
			else {
				callAPI(bookInput);
			}
		}
	}

	const callAPI = (bookInput: BookInput) => {
		if (!props.bookToEdit) {
			bookAPI.createBook(bookInput)
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
			bookAPI.updateBook(props.bookToEdit.id, bookInput)
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
		formik.resetForm();
		setReleasedDate(props.bookToEdit ? props.bookToEdit.releaseAt.substring(0, 10) : '');
		if (props.bookToEdit && props.bookToEdit.categories) {
			setSelectedGenres([ ...props.bookToEdit.categories ]);
		}
		else {
			setSelectedGenres([]);
		}
		if (props.bookToEdit && props.bookToEdit.authors) {
			setSelectedAuthors([ ...props.bookToEdit.authors ]);
		}
		else {
			setSelectedAuthors([]);
		}
		// console.log(props.genreList.map(genre => genre.name));
		const dateInputElem = $('#mui-date-hidden input');
		dateInputElem.attr('id', 'mui-date-input');
		// console.log(dateInputElem);
		const chipInputPlaceHolderElems = $("input[aria-controls='react-autowhatever-1']");
		chipInputPlaceHolderElems.css({ "font-size": "1rem", "font-weight": "400", "line-height": "1.5", "color": "#495057" });
	}

	const onModalClose = () => {
		setBookFile(null);
		setBookImage(null);
		setReleasedDate('');
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

	const handleChoosingBookImage = (e: any) => {
		console.log(e.target.files);
		if (e.target.files[0]) {
			const image = e.target.files[0];
			setBookImage(image);
		}
	};

	const handleChoosingBookFile = (e: any) => {
		console.log(e.target.files);
		if (e.target.files[0]) {
			const file = e.target.files[0];
			setBookFile(file);
		}
	};

	const formik = useFormik({
		initialValues: props.bookToEdit
				? {
					...props.bookToEdit,
					categoryIds: props.bookToEdit.categories
							? [ ...props.bookToEdit.categories.map(category => category.id) ]
							: [],
					authorIds: props.bookToEdit.authors
							? [ ...props.bookToEdit.authors.map(author => author.id) ]
							: [],
				}
				: {
					releaseAt: '',
					title: '',
					publisher: '',
					image: '',
					link: '',
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
						{/* <Form.Label>Published At</Form.Label> */}
						{/* <Form.Control
							id="bookDescription"
							name="description"
							placeholder="The Little Prince is a novella by French aristocrat, writer, and aviator Antoine de Saint-Exupéry."
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.description}
						/> */}
						<div id="mui-date-hidden" style={{ display: 'none' }}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DatePicker
									value={releasedDate}
									onChange={(date: any) => {
										if (date) {
											setReleasedDate(date.toISOString().substring(0, 10));
										}
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>
						<Form.Label>Published At</Form.Label>
						<InputGroup style={{ position: "relative" }}>
							<Form.Control
								name="releasedDate"
								placeholder="Released Date"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={releasedDate}
							/>
							<label style={{ position: "absolute", width: "100%", height: "100%", cursor: "pointer" }} htmlFor="mui-date-input"/>
							{/* <InputGroup.Append>
								<label htmlFor="date-field">
									<Button
										variant="outline-secondary"
										as="span"
										style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
									>
										{props.children}
									</Button>
								</label>
							</InputGroup.Append> */}
						</InputGroup>
					</Form.Group>
					{/* <Form.Group>
						<Form.Label>Book Image URL</Form.Label>
						<Form.Control
							id="bookImageURL"
							name="image"
							placeholder="www.google.com"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.image}
						/>
					</Form.Group> */}
					<Form.Group>
						<Form.Label>Book Image</Form.Label>
						<InputGroup>
							<Form.Control
								name="bookImage"
								placeholder="Images Path"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={(bookImage != null && bookImage.name != null) ? bookImage.name : '' }
							/>
							<InputGroup.Append>
								<UploadButton
									accept="image/*"
									onChange={handleChoosingBookImage}
									inputId="image"
								>
									...
								</UploadButton>
							</InputGroup.Append>
						</InputGroup>
					</Form.Group>
					<Form.Group>
						<Form.Label>Book File</Form.Label>
						<InputGroup>
							<Form.Control
								name="bookFile"
								placeholder="File Path"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={(bookFile != null && bookFile.name != null) ? bookFile.name : '' }
							/>
							<InputGroup.Append>
								<UploadButton
									accept=".epub"
									onChange={handleChoosingBookFile}
									inputId="file"
								>
									...
								</UploadButton>
							</InputGroup.Append>
						</InputGroup>
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
								&& (!selectedGenres ||
									selectedGenres?.findIndex(genre => genre.name == opt.name) === -1)
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
								&& (!selectedAuthors ||
									selectedAuthors?.findIndex(author => author.name == opt.name) === -1)
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