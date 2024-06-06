import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
query showAll($page: Float!, $limit: Float!, $sortBy: [SortBy!]!, $filter: [FilterBy!]!, $except: String!){
    books(page: $page, limit: $limit, sortBy: $sortBy, filter: $filter, except: $except){
        id,
        price,
        title,
        description,
        quantity,
        discount,
        avgRating,
      	images{
          key,
          name,
          size,
          url
        },
        promotion{
            type{
                saleType,
                saleValue
            }
        }
    }
}
`;

export const GET_BOOK = gql`
query showOne($input: Int!){
    book(id: $input){
        price,
        title,
        description,
        discount,
        images{
            key,
            name,
            size,
            url
        },
        categories{
            category{
                id,
                name,
                description
            }
        },
        authors{
            author{
                id,
                firstName,
                lastName
            }
        },
        reviews{
            comment,
            rating,
            user{
                firstName,
                lastName
            },
            createdAt
        },
        promotion{
            type{
                saleType,
                saleValue
            }
        }
    }
}
`;

export const GET_TOTAL_BOOKS = gql`
query getTotal($filter: [FilterBy!]!){
    totalBooks(filter: $filter)
}
`;

export const GET_AUTHORS = gql`
query{
    authors{
        id,
        firstName,
        lastName
    }
}
`;

export const GET_CATEGORIES = gql`
query{
    categories{
        id,
        name,
        description
    }
}
`;

export const CREATE_COMMENT = gql`
mutation createReview($input: CreateReviewInput!){
    createReview(createReviewInput: $input){
        id,
        rating,
        comment,
    }
}
`;
