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
	link: string,
}

export interface BookInput {
	releaseAt: string,
	title: string,
	publisher: string,
	image: string,
	link: string,
	description: string,
	categoryIds: string[],
	authorIds: string[],
}