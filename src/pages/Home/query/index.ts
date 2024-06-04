import { gql } from "@apollo/client";

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
