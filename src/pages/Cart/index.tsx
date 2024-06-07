import { useQuery } from "@apollo/client";
import CartItem from "../../components/CartItem";
import Checkout from "../../components/Checkout";
import { Loading } from "../../components/Loading";
import { GET_CART } from './query';
import { Empty } from 'antd';
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useCookies } from "react-cookie";
import CartItemCookie from "../../components/CartItemCookie";
import CheckoutCookie from "../../components/CheckoutCookie";

const Cart = () => {
    const user = useContext(AuthContext);

    if (user) {
        const { loading, error, data } = useQuery(GET_CART, {
            variables: {
                id: user.id
            }
        });


        const renderCartItems = () => {
            if (data.cart.cartItems.length == 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            return data.cart.cartItems.map((cartItem: any) => {
                return <CartItem
                    key={cartItem.id}
                    userId={user.id}
                    cartItemId={cartItem.id}
                    bookQuantity={cartItem.book.quantity}
                    title={cartItem.book.title}
                    price={cartItem.book.price}
                    discount={cartItem.book.discount}
                    images={cartItem.book.images}
                    quantity={cartItem.quantity}
                    promotion={cartItem.book.promotion}
                />
            });
        }



        return <div className="p-8 min-h-screen">
            <div className="w-2/3 mx-auto text-lg">
                {
                    error ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        loading ? <Loading /> : <div className="flex justify-between mt-4">
                            <div className="w-2/3 bg-gray-700 p-4 rounded-lg text-white">
                                {renderCartItems()}
                            </div>
                            <div className="w-1/3 bg-gray-700 p-4 rounded-lg text-white ml-4">
                                <Checkout cartItems={data.cart.cartItems} />
                            </div>
                        </div>
                }
            </div>
        </div>
    } else {
        const [cookie, setCookie, removeCookie] = useCookies(['cart']);
        const renderCartItemsCookie = () => {
            if (cookie.cart.length == 0) {
                return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            return cookie.cart.map((cartItem: any, index: number) => {
                return <CartItemCookie cartItem={cartItem} index={index} />
            })
        }
        return <div className="p-8 min-h-screen">
            <div className="w-2/3 mx-auto text-lg">
                <div className="flex justify-between mt-4">
                    <div className="w-2/3 bg-gray-700 p-4 rounded-lg text-white">
                        {renderCartItemsCookie()}
                    </div>
                    <div className="w-1/3 bg-gray-700 p-4 rounded-lg text-white ml-4">
                        <CheckoutCookie cartItems={cookie.cart} />
                    </div>
                </div>
            </div>
        </div>

    }
}

export default Cart;
