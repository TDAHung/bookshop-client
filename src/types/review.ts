import { UserEntity } from "./user";

export interface ReviewEntity {
    id: number;
    comment: string;
    rating: string;
    user: UserEntity;
    createdAt: Date;
};
