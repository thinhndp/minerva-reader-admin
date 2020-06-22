import { Genre } from './genre';
import { Author } from './author';

export interface Book {
	id: string,
	releaseAt: string,
	title: string,
	publisher: string,
	image: string,
	description: string,
	categories: Genre[],
	authors: Author[],
	rating: number,
}

export interface BookInput {
	releaseAt: string,
	title: string,
	publisher: string,
	image: string,
	description: string,
	categoryIds: Genre[],
	authorIds: Author[],
}