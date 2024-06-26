import { gql } from "@apollo/client";

export const GET_CART = gql`
query showCart($id: Int!){
    cart(id: $id){
        id,
        userId,
        user{
            firstName,
            lastName,
        },
        cartItems{
            id,
            quantity,
            book{
                id,
                title,
                price,
                discount,
                quantity,
                images{
                    name,
                    url,
                    key
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
}
`;
