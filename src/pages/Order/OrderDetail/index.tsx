import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";
import OrderItem from "../../../components/OrderItem";
import { useQuery } from "@apollo/client";
import { GET_ORDER } from "../query";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { OrderEntity, OrderItemEntity } from "../../../types";
import { Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    CarOutlined,
} from '@ant-design/icons';

export const OrderDetail = () => {

    const user = useContext(AuthContext);
    if (!user) {
        return <div className="p-4">
            PLease Login to exceed
        </div>;
    }

    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            input: Number(id)
        }
    });

    let total = 0;
    let totalQuantity = 0;
    if (!error && !loading) {
        data.order.orderItems.forEach(({ book, quantity }: OrderItemEntity) => {
            totalQuantity += quantity;
            if (book?.promotion?.type) {
                if (book.promotion.type.saleType == "samePrice")
                    total += Number(book.promotion.type.saleValue);
                else total += ((book.price * quantity) - (book.price * quantity) * (Number(book.promotion.type.saleValue) / 100));
            } else {
                total += ((book.price * quantity) - (book.price * quantity) * (book.discount / 100));
            }
        });
    }

    const renderStatus = (order: OrderEntity) => {
        switch (order.status) {
            case "PENDING":
                return <Tag icon={<ExclamationCircleOutlined />} color="processing">
                    ORDERED
                </Tag>;
            case "COMPLETED":
                return <Tag icon={<CheckCircleOutlined />} color="success">
                    COMPLETED
                </Tag>;
            case "CANCELED":
                return <Tag icon={<CloseCircleOutlined />} color="error">
                    CANCELED
                </Tag>;
            case "SHIPPING":
                return <Tag icon={<SyncOutlined spin />} color="processing">
                    SHIPPING
                </Tag>;
            case "SHIPPED":
                return <Tag icon={<CarOutlined />} color="gold">
                    SHIPPED
                </Tag>;
            default:
                return;
        }
    };

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
                promotion={orderItem.book.promotion} />;
        });
    };

    return (
        error || loading ? <Loading /> :
            <div>
                <div className="flex justify-between mt-4 w-2/3 mx-auto">
                    <div className="w-2/3 bg-gray-700 p-4 rounded-lg text-white">
                        {renderOrderItems()}
                    </div>
                    <div className="w-1/3 bg-gray-700 py-4 rounded-lg text-white ml-4">
                        <h3 className="font-bold text-lg mb-4 ps-2">Summary</h3>
                        <div className="flex justify-between ps-2 items-center mb-2 font-bold">
                            <span>
                                Status:
                            </span>
                            {renderStatus(data.order)}
                        </div>

                        <div className="flex justify-between mb-2 px-2">
                            <span>Products: </span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div className="flex justify-between mb-4 font-bold px-2">
                            <span>Total amount (including VAT)</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default OrderDetail;
