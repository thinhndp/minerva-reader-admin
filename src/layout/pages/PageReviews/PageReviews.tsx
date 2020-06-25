import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as reviewAPI from '../../../api/reviewAPI';
import * as bookAPI from '../../../api/bookAPI';

// Interface
import { Review } from '../../../interfaces/review';
import { Book } from '../../../interfaces/book';

// Component
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageGenres.module.scss';

const PageReviews: FunctionComponent = () => {
	const [reviews, setReviews] = useState<Array<Review>>([]);
	const [books, setBooks] = useState<Array<Book>>([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	// Delete Dialog
	const [reviewIdToDelete, setReviewIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
	const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);

	const columns: Array<Column<Review>> = [
		{ title: 'Id', field: 'id', editable: 'never', cellStyle: { width: '300px' } },
		{
			title: 'Book',
			field: 'bookId',
			render: (rowData) => {
				console.log(books);
				const book: Book | undefined = books.find(book => book.id === rowData.bookId);
				console.log(book);
				const bookTitle = book ? book.title : 'Unknown';
				return (<span>{bookTitle}</span>);
			}
		},
		{ title: 'Comment', field: 'comment' },
		{ title: 'User', field: 'username' },
		{ title: 'Reports', field: 'reportCount' },
	]

	useEffect(() => {
		getAllReviewsAndBooks();
	}, []);

	const getAllReviewsAndBooks = () => {
		setIsTableLoading(true);
		const getReviewsPromise = reviewAPI.getReviews();
		const getBooksPromise = bookAPI.getAllBooks();
		Promise.all([getReviewsPromise, getBooksPromise])
			.then(([ reviewsResponse, booksResponse ]) => {
				setIsTableLoading(false);
				setReviews(reviewsResponse.data.review);
				setBooks(booksResponse.data.books);
			})
			.catch(error => {
				setIsTableLoading(false);
				console.log(error);
			})
	}

	const getReviews = () => {
		setIsTableLoading(true);
		reviewAPI.getReviews()
		.then(response => {
			setIsTableLoading(false);
			setReviews(response.data.review);
		})
		.catch(err => {
			setIsTableLoading(false);
		})
	}

	const onDeleteClick = (event: any, review: any) => {
		setReviewIdToDelete(review.id);
		setIsDialogDeleteOpen(true);
	}

	const deleteReview = (id: string) => {
		setIsLoadingDelete(true);
		reviewAPI.deleteReview(id)
			.then((response) => {
				setIsLoadingDelete(false);
				closeDialogDelete();
				getReviews();
			})
			.catch((err) => {
				setIsLoadingDelete(false);
				console.log(err);
			})
	}

	const closeDialogDelete = () => {
		setReviewIdToDelete('');
		setIsDialogDeleteOpen(false);
	}

	return (
		<div>
			<MaterialTable
				title="Reviews"
				isLoading={isTableLoading}
				columns={columns}
				data={reviews}
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
					{ icon: 'delete', tooltip: 'Delete', onClick: (event, rowData) => onDeleteClick(event, rowData) },
				]}
				components={{
					Action: prevProps => {
						// if (prevProps.action.icon === 'add') {
						// 	// Override 'add' Action
						// 	return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{ marginLeft: '20px' }} onClick={() => onAddClick()}>Add Genre</Button>;
						// }

						return <MTableAction {...prevProps} />
					}
				}}
			/>
			<DialogYesNo
				isOpen={isDialogDeleteOpen}
				isLoadingYes={isLoadingDelete}
				onYes={() => { deleteReview(reviewIdToDelete); }}
				onNo={() => { closeDialogDelete(); }}
				onClose={() => { closeDialogDelete(); }}
			/>
		</div>
	);
}

export default PageReviews;