import { BookEntity } from "./books";
import { CategoryEntity } from "./category";

export interface BookCategoryEntity {
    id: number;
    book: BookEntity;
    category: CategoryEntity;
    createdAt: Date;
    updatedAt: Date;
}
