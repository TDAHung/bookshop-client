import { gql } from "@apollo/client";

export const GET_CART = gql`
query showCart($id: Int!){
    cart(id: $id){
        cartItems{
            id,
        }
    }
}
`;
