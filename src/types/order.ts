import { BookEntity } from "./books";
import { UserEntity } from "./user";

export interface OrderItemEntity {
    id: number;
    bookId: number;
    book: BookEntity;
    price: number;
    quantity: number;
    orderId: number;
}

export interface OrderEntity {
    id: number;
    address: string;
    phone: string;
    status: string;
    total: number;
    firstName: string;
    lastName: string;
    user: UserEntity;
    orderItems: OrderItemEntity[];
};
