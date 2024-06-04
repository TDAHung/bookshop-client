import React from 'react';
import { gql, useQuery } from "@apollo/client";
import CartItem from "../../components/CartItem";
import Checkout from "../../components/Checkout";
import { Loading } from "../../components/Loading";
import { GET_CART } from './query';
import { useAuth } from '../../contexts/authProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Empty } from 'antd';
// import Empty from '../../components/Empty';


const Cart = () => {
    const { getUser } = useAuth();
    const user = getUser();
    const { loading, error, data } = useQuery(GET_CART, {
        variables: {
            id: user.id
        }
    });

    const renderCartItems = () => {
        return data.cart.cartItems.map((cartItem: any) => {
            return <CartItem
                key={cartItem.id}
                userId={user.id}
                cartItemId={cartItem.id}
                bookId={cartItem.book.id}
                title={cartItem.book.title}
                price={cartItem.book.price}
                discount={cartItem.book.discount}
                images={cartItem.book.images}
                quantity={cartItem.quantity}
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
}

export default Cart;
