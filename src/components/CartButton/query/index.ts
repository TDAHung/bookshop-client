import { gql } from "@apollo/client";

export const CHECK_CART = gql`
  query showCart($id: Int!) {
    cart(id: $id) {
      id
    }
  }
`;

export const CHECK_CART_ITEM = gql`
  query checkCartItem($bookId: Int!, $cartId: Int!) {
    checkCartItem(bookId: $bookId, cartId: $cartId)
  }
`;
