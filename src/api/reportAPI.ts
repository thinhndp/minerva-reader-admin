import axios from 'axios';

export const getReportsByReviewId = (reviewId: string) => {
	return axios.get(`/reviews/${reviewId}/reports`);
}
