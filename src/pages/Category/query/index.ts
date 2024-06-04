import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
query category($input: Int!){
    category(id: $input){
        name,
        description,
        banner,
        bannerColor,
        books{
            book{
                id
                title,
                price,
                description,
                discount,
                quantity,
                images{
                    key,
                    name,
                    url,
                }
            }
        }
    }
}
`;

export const GET_CATEGORIES = gql`
    query{
        categories{
            id,
            name,
            description,
            banner,
            bannerColor
        }
    }
`;

export const GET_BOOKS = gql`
query showAll($limit: Float!, $filter: [FilterBy!]!, $search: [SearchBy!]!){
    books(limit: $limit, filter: $filter, search: $search){
        id,
        price,
        title,
        description,
        quantity,
        discount
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
