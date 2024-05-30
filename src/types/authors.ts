import { ImageEntity } from "./image";

export interface AuthorEntity {
    id: number;
    bio: string;
    // books: [AuthorBookEntity!]!
    firstName: string;
    lastName: string;
    thumpnail: ImageEntity;
    updatedAt: Date
    createdAt: Date
}
