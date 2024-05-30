import { AuthorEntity } from "./authors";
import { BookEntity } from "./books";

export interface BookAuthorEntity {
    id: number;
    book: BookEntity;
    author: AuthorEntity;
}
