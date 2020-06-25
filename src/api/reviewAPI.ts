import { Review } from '../interfaces/review';
import axios from 'axios';

export const getReviews = () => {
	return axios.get('/reviews');
}

export const deleteReview = (id: string) => {
	return axios.delete(`/reviews/${id}`);
}
