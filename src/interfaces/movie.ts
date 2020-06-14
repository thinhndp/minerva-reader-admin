import { Genre } from "./genre";
import { ScreenType } from "./screenType";
import { Rate } from "./rate";

export interface Actor {
  name: string,
  avatar: string,
}

export interface Movie {
  id: string,
  title: string,
  storyline: string, //
  genres: Genre[],
  screenTypes: ScreenType[],
  directors: string[],
  actors: Actor[],
  country: string,
  released: string,
  endAt: string,
  runtime: number,
  poster: string,
  trailer: string, //
  wallpapers: string[], //
  rated: Rate,
}

export interface MovieInsertInput {
  imdbID: string,
  actors: Actor[],
  endAt: string,
  screenTypeIds: string[],
}

export interface MovieUpdateInput {
  title: string,
  storyline: string, //
  actors: Actor[],
  released: string, //
  endAt: string,
  poster: string,
  trailer: string, //
  wallpapers: string[], //
  rateId: string,
  screenTypeIds: string[],
}