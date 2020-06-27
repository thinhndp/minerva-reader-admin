import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as bookAPI from '../../../api/bookAPI';
import * as genreAPI from '../../../api/genreAPI';
import * as authorAPI from '../../../api/authorAPI';

import { Link } from 'react-router-dom';

// Interface
import { Book } from '../../../interfaces/book';
import { Author } from '../../../interfaces/author';
import { Genre } from '../../../interfaces/genre';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import ModalAddOrEditBook from './components/ModalAddOrEditBook';
import DialogYesNo from '../../../components/DialogYesNo';

import styles from './PageBooks.module.scss';

const NO_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const PageBooks: FunctionComponent = () => {
  const [books, setBooks] = useState<Array<Book>>([]);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  // Delete Dialog
  const [bookIdToDelete, setBookIdToDelete] = useState('');
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [authors, setAuthors] = useState<Array<Author>>([]);
  const [genres, setGenres] = useState<Array<Genre>>([]);
//   let authors: Author[] = [];
//   let genres: Genre[] = [];
  
  const columns: Array<Column<Book>> = [
	{ title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
	{ title: 'Title', field: 'title' },
	{ title: 'Description', field: 'description' },
	{
		title: 'Authors',
		field: 'authors',
		render: (rowData) => {
			const authorNameList = rowData.authors ? rowData.authors.map(author => author.name) : [ 'Unknown' ];
			const formattedAuthorList = authorNameList.join(', ');
			return (<span>{formattedAuthorList}</span>);
		}
	},
	{
		title: 'Genres',
		field: 'categories',
		render: (rowData) => {
			const genreNameList = rowData.categories ? rowData.categories.map(category => category.name) : [ 'n/a' ];
			const formattedGenreList = genreNameList.join(', ');
			return (<span>{formattedGenreList}</span>);
		}
	},
	{
		title: 'Download Link',
		field: 'link',
		render: (rowData) => {
			return (
				rowData.link 
				 ? <a className={styles['link']} href={rowData.link}>Download</a>
				 : <div>Not Available</div>
			);
		}
	},
	{
		title: 'Book Image',
		field: 'image',
		render: (rowData) => {
			return (
				<span>
					<img
						src={rowData.image ? rowData.image : NO_IMAGE_URL}
						alt={`${rowData.title}`}
						style={{ width: 100, height: 'auto' }}
					/>
				</span>
			);
		}
	},
  ]

  useEffect(() => {
	getAllBooks();
  }, []);

  const getAllBooks = () => {
	setIsTableLoading(true);
	const getAllBooksPromise = bookAPI.getAllBooks();
	const getAllAuthorsPromise = authorAPI.getAllAuthors();
	const getAllGenresPromise = genreAPI.getAllGenres();
	Promise.all([ getAllBooksPromise, getAllAuthorsPromise, getAllGenresPromise ])
			.then(([ bookResponse, authorResponse, genreResponse]) => {
				// console.log(responses)
				setIsTableLoading(false);
				setBooks(bookResponse.data.books);
				// authors = [ ...authorResponse.data.authors ];
				// genres = [ ...genreResponse.data.categories ];
				setAuthors([ ...authorResponse.data.authors ]);
				setGenres([ ...genreResponse.data.categories ]);
				console.log(genres);
			})
			.catch(error => {
				setIsTableLoading(false);
			})
	// bookAPI.getAllBooks()
	//   .then(response => {
	// 	setIsTableLoading(false);
	// 	setBooks(response.data.books);
	//   })
	//   .catch(error => {
	// 	setIsTableLoading(false);
	//   })
  }

  const onAddClick = () => {
	setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, book: any) => {
	setBookToEdit(book);
	setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, book: any) => {
	setBookIdToDelete(book.id);
	setIsDialogDeleteOpen(true);
  }
  
  const deleteBook = (id: string) => {
	setIsLoadingDelete(true);
	bookAPI.deleteBook(id)
	  .then((response) => {
		setIsLoadingDelete(false);
		closeDialogDelete();
		getAllBooks();
	  })
	  .catch((err) => {
		setIsLoadingDelete(false);
		console.log(err);
	  })
  }
  
  const closeDialogDelete = () => {
	setBookIdToDelete('');
	setIsDialogDeleteOpen(false);
  }

  return (
	<div>
	  <MaterialTable
		title="Books"
		isLoading={isTableLoading}
		columns={columns}
		data={books}
		options={{
		  headerStyle: {
			backgroundColor: '#009be5',
			color: '#fff',
		  },
		  rowStyle: {
			backgroundColor: '#eee',
		  },
		}}
		actions={[
		  { icon: 'edit', tooltip: 'Edit', onClick: (event, rowData) => onUpdateClick(event, rowData) },
		  { icon: 'delete', tooltip: 'Delete', onClick: (event, rowData) => onDeleteClick(event, rowData) },
		  { icon: 'add', tooltip: 'Add', onClick: () => {}, isFreeAction: true }, // Will be overrided right below
		]}
		components={{
		  Action: prevProps => {
			if (prevProps.action.icon === 'add') {
			  // Override 'add' Action
			  return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Book</Button>;
			}

			return <MTableAction {...prevProps} />
		  }
		}}
	  />
	  <ModalAddOrEditBook
		bookToEdit={bookToEdit}
		isOpen={isDialogAddOrEditOpen}
		onClose={() => {
		  setIsDialogAddOrEditOpen(false);
		  setTimeout(() => {
			setBookToEdit(null);
		  }, 150);
		}}
		onSave={() => {
		  setIsDialogAddOrEditOpen(false);
		  setTimeout(() => {
			setBookToEdit(null);
		  }, 150);
		  getAllBooks();
		}}
		authorList={authors}
		genreList={genres}
	  />

	  
	  <DialogYesNo
		isOpen={isDialogDeleteOpen}
		isLoadingYes={isLoadingDelete}
		onYes={() => {deleteBook(bookIdToDelete);}}
		onNo={() => {closeDialogDelete();}}
		onClose={() => {closeDialogDelete();}}
	  />
	</div>
  );
}

export default PageBooks;