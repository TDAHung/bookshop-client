import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, message } from 'antd';
import { GET_CART as GET_CART_POPUP } from '../CartPopUp/query';
import { CHECK_CART, CHECK_CART_ITEM } from './query';
import { CREATE_CART, CREATE_CART_ITEM } from './mutation';
import { GET_CART } from '../../pages/Cart/query';



const CartButton = ({ userId, bookId, cartId }: { userId: number, bookId: number, cartId: number }) => {
    const [createCart] = useMutation(CREATE_CART, {
        refetchQueries: [
            { query: CHECK_CART, variables: { id: userId } },
            { query: GET_CART_POPUP, variables: { id: userId } },
            { query: GET_CART, variables: { id: userId } }
        ],
    });
    const [createCartItem] = useMutation(CREATE_CART_ITEM, {
        refetchQueries: [
            { query: CHECK_CART, variables: { id: userId } },
            { query: GET_CART_POPUP, variables: { id: userId } },
            { query: GET_CART, variables: { id: userId } },
            { query: CHECK_CART_ITEM, variables: { bookId, cartId } }
        ],
    });
    const checkCartItem = useQuery(CHECK_CART_ITEM, {
        variables: {
            bookId,
            cartId
        }
    });

    const handleAddToCart = async () => {
        try {
            if (!cartId) {
                const { data: newCartData } = await createCart({
                    variables: {
                        input: { userId },
                    },
                });
                await createCartItem({
                    variables: {
                        input: { quantity: 1, cartId: newCartData.createCart.id, bookId },
                    },
                });
                message.success('Book added to cart successfully');
            }

            if (cartId) {
                const { data: checkCartItemData } = await checkCartItem.refetch({
                    variables: { bookId, cartId }
                });
                if (checkCartItemData?.checkCartItem) {
                    message.info('Book already exists in cart');
                } else {
                    await createCartItem({
                        variables: {
                            input: { quantity: 1, cartId, bookId },
                        },
                    });
                    message.success('Book added to cart successfully');
                }
            }
        } catch (error) {
            console.log(error);
            message.error('Failed to add book to cart');
        }
    };

    return (
        <div className="text-center">
            <Button
                onClick={handleAddToCart}
                className="bg-violet-500 text-white text-xl m-auto w-3/4"
            >
                Add to cart
            </Button>
        </div>
    );
};

export default CartButton;
