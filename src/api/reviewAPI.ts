import axios from 'axios';


export const getReviews = () => {
	return axios.get('/reviews');
}

export const getReviewById = (id: string) => {
	return axios.get(`/reviews/${id}`);
}

export const deleteReview = (id: string) => {
	return axios.delete(`/reviews/${id}`);
}
