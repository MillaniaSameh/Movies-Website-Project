import { IReview } from "./ireview";

export interface IMovie {
    movieId: number,
    title: string,
    description: string,
    releaseYear: number,
    poster: string,
    actors: string[],
    reviews: IReview[]
}
