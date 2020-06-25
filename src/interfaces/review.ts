export interface Report {
	id: string,
	createAt: string,
	reason: string,
	username: string,
	reviewId: string,
}

export interface Review {
	id: string,
	update: string,
	comment: string,
	bookId: string,
	username: string,
	rating: number,
	upvotes: string[],
	reports: Report[],
	upvoteCount: number,
	reportCount: number,
}
