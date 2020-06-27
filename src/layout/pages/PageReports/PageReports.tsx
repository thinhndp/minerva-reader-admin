import React, { useEffect, useState, FunctionComponent } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// Misc
import * as reportAPI from '../../../api/reportAPI';
import * as reviewAPI from '../../../api/reviewAPI';

// Interface
import { Report, Review } from '../../../interfaces/review';

// Component
import MaterialTable, { Column, MTableAction } from 'material-table';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';

import ModalReviewDetail from './components/ModalReviewDetail';

// Class
import styles from './PageReports.module.scss';

interface IPageReportsProps {
	genreId: string,
}

const PageReports: FunctionComponent = () => {
	const [reports, setReports] = useState<Array<Report>>([]);
	const [review, setReview] = useState<Review>();
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [isModalReviewDetailOpen, setIsModalReviewDetailOpen] = useState(false);
	let { reviewId } = useParams();
	let history = useHistory();

	const columns: Array<Column<Report>> = [
		{ title: 'Id', field: 'id', editable: 'never', cellStyle: { width: '300px' } },
		{ title: 'Created At', field: 'createAt' },
		{ title: 'Reason', field: 'reason' },
		{ title: 'User', field: 'username' },
	]

	useEffect(() => {
		getAllReportsOfReview();
	}, []);

	const getAllReportsOfReview = () => {
		if (!reviewId) {
			return;
		}
		setIsTableLoading(true);

		// reportAPI.getReportsByReviewId(reviewId)
		// .then(response => {
		// 	setIsTableLoading(false);
		// 	setReports(response.data.reports);
		// })
		// .catch(err => {
		// 	setIsTableLoading(false);
		// })
		const getReviewPromise = reviewAPI.getReviewById(reviewId);
		const getReportsPromise = reportAPI.getReportsByReviewId(reviewId);
		Promise.all([ getReviewPromise, getReportsPromise ])
			.then(([ reviewResponse, reportsResponse ]) => {
				setIsTableLoading(false);
				console.log(reviewResponse);
				setReview(reviewResponse.data.review);
				setReports(reportsResponse.data.reports);
			})
			.catch(error => {
				setIsTableLoading(false);
				console.log(error);
			})
	}

	const onBackClick = () => {
		history.push('/reviews');
	}

	const onReviewIdClick = () => {
		setIsModalReviewDetailOpen(true);
	}

	return (
		<div>
			<MaterialTable
				title={<div className={styles['title']}>Reports of Review&nbsp;
						<span className={styles['report-id']} onClick={onReviewIdClick}>{reviewId}</span></div>}
				isLoading={isTableLoading}
				columns={columns}
				data={reports}
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
					{ icon: 'back', tooltip: 'Back', onClick: () => {}, isFreeAction: true },
				]}
				components={{
					Action: prevProps => {
						if (prevProps.action.icon === 'back') {
							return <Button variant="contained" color="primary" startIcon={<ArrowBack />} style={{ marginLeft: '20px' }} onClick={() => onBackClick()}>Back to Reviews</Button>;
						}
						return <MTableAction {...prevProps} />
					}
				}}
			/>
			<ModalReviewDetail
				review={review!}
				isOpen={isModalReviewDetailOpen}
				onClose={() => {
					setIsModalReviewDetailOpen(false);
					// setTimeout(() => {
					// 	setBookToEdit(null);
					// }, 150);
				}}
			/>
		</div>
	);
}

export default PageReports;