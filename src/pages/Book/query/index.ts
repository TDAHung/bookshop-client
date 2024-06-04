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
        }
    }
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
