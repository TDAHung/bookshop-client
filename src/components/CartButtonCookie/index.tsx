import { Button, message } from 'antd';
import { BookEntity } from '../../types';
import { useCookies } from 'react-cookie';

const CartButtonCookie = ({ book }: { book: BookEntity }) => {

    const [cookies, setCookie, removeCookie] = useCookies(["cart"]);
    const handleAddToCart = async () => {
        try {
            if (!cookies.cart) {
                const cart = {
                    quantity: 1,
                    book
                };
                setCookie('cart', [cart], { path: "/", maxAge: 3600 * 24, secure: true, sameSite: "strict" });

                message.success('Book added to cart successfully');
            } else {
                const cartItems = cookies.cart;
                const index = cartItems.findIndex((item: any) => {
                    return item.book.id === book.id;
                });

                if (index >= 0) {
                    message.info('Book already exists in cart');
                } else {
                    const cart = {
                        quantity: 1,
                        book
                    };
                    cartItems.push(cart);
                    setCookie('cart', cartItems, { path: "/", maxAge: 3600 * 24, secure: true, sameSite: "strict" });
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

export default CartButtonCookie;
