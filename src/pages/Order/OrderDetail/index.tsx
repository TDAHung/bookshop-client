import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";
import OrderItem from "../../../components/OrderItem";
import { useQuery } from "@apollo/client";
import { GET_ORDER } from "../query";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { OrderItemEntity } from "../../../types";

const OrderDetail = () => {

    const user = useContext(AuthContext);
    if (!user) {
        return <div className="p-4">
            PLease Login to exceed
        </div>
    }

    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            input: Number(id)
        }
    })

    let total = 0;
    let totalQuantity = 0;
    data.order.orderItems.forEach(({ book, quantity }: OrderItemEntity) => {
        total += ((book.price * quantity) - (book.price * quantity) * (book.discount / 100));
        totalQuantity += quantity;
    });

    const renderOrderItems = () => {
        return data.order.orderItems.map((orderItem: OrderItemEntity) => {
            return <OrderItem
                key={orderItem.id}
                cartItemId={orderItem.id}
                bookId={orderItem.book.id}
                title={orderItem.book.title}
                price={orderItem.book.price}
                discount={orderItem.book.discount}
                images={orderItem.book.images}
                quantity={orderItem.quantity}
            />
        });
    }

    return (
        error || loading ? <Loading /> :
            <div>
                <div className="flex justify-between mt-4 w-2/3 mx-auto">
                    <div className="w-2/3 bg-gray-700 p-4 rounded-lg text-white">
                        {renderOrderItems()}
                    </div>
                    <div className="w-1/3 bg-gray-700 p-4 rounded-lg text-white ml-4">
                        <h3 className="font-bold text-lg mb-4">Summary</h3>
                        <div className="flex justify-between mb-2">
                            <span>Products: </span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div className="flex justify-between mb-4 font-bold">
                            <span>Total amount (including VAT)</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div >
    )
}

export default OrderDetail;
