import { gql } from "@apollo/client";

export const UPDATE_CART_ITEM = gql`
mutation updateCartItem($input: UpdateCartItemInput!){
    updateCartItem(updateCartItem: $input){
        id,
        bookId,
        quantity,
    }
}
`;

export const DELETE_CART_ITEM = gql`
mutation removeCartItem($id: Int!){
    removeCartItem(id: $id){
        id,
        bookId
    }
}
`;
