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
                images{
                    name,
                    url,
                    key
                }
            }
        }
    }
}
`;

export const GET_ORDERS = gql`
query orders($input: Int!){
    orders(userID: $input){
        id,
        address,
        phone,
        status,
        total,
        firstName,
        lastName,
        orderItems{
            bookId,
            price,
            quantity,
            book{
                title,
                price,
                discount,
                images{
                    url,
                    key,
                    name
                }
            }
        }
    }
}
`;

export const GET_ORDER = gql`
query order($input: Int!){
    order(id: $input){
        id,
        address,
        phone,
        status,
        total,
        firstName,
        lastName,
        orderItems{
            bookId,
            price,
            quantity,
            book{
                title,
                price,
                discount,
                images{
                    url,
                    key,
                    name
                }
            }
        }
    }
}
`;
