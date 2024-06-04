import { gql } from "@apollo/client";

export const CREATE_CART = gql`
mutation createCart($input: CreateCartInput!){
    createCart(createCart: $input){
        id
    }
}
`;

export const CREATE_CART_ITEM = gql`
  mutation createCartItem($input: CreateCartItemInput!) {
    createCartItem(createCartItem: $input) {
      id
      bookId
      quantity
    }
  }
`;
