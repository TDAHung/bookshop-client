import { BookAuthorEntity } from "./bookAuthor";
import { BookCategoryEntity } from "./bookCategory";
import { ImageEntity } from "./image"
import { PromotionEntity } from "./promotion";
import { ReviewEntity } from "./review";

export interface BookEntity {
    id: number;
    authors: [BookAuthorEntity]
    avgRating: number
    categories: [BookCategoryEntity]
    description: string;
    discount: number;
    images: [ImageEntity]
    price: number;
    quantity: number
    reviews: [ReviewEntity]
    title: string;
    promotion: PromotionEntity;
    createdAt: Date;
    updatedAt: Date
}
