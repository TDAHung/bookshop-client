import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
query showAll($limit: Float!, $sortBy: [SortBy!]!){
    books(limit: $limit, sortBy: $sortBy){
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

export const GET_PROMOTIONS = gql`
query promotions($limit: Float!, $sortBy: [PromotionSortBy!]!){
    promotions(limit: $limit, sortBy: $sortBy){
        type{
            saleType,
            saleValue
        }
        startDate,
        endDate,
        books{
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
            promotion{
                type{
                    saleType,
                    saleValue
                }
            }
        }
    }
}
`;
