import { BookEntity } from "./books";

export interface TypePromotionEntity {
    saleType: string;
    saleValue: string;
}

export interface PromotionEntity {
    id: number;
    type: TypePromotionEntity;
    books: BookEntity[];
    startDate: Date;
    endDate: Date;
}
