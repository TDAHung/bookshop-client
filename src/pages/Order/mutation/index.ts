import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
mutation create($createOrder: CreateOrderInput!){
    createOrder(createOrder: $createOrder){
        id,
        address,
        status
    }
}
`;

export const DELETE_CART = gql`
mutation removeCart($id: Float!){
    removeCart(id: $id){
        id
    }
}
`;
