import { Loading } from "../../components/Loading";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "./query";
import { OrderEntity } from "../../types";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    CarOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import { pages } from "../../utils/constant";
import { Link } from "react-router-dom";

const Order = () => {
    const user = useContext(AuthContext);
    if (!user) {
        return <div className="p-4">
            PLease Login to exceed
        </div>
    }
    const { loading, error, data } = useQuery(GET_ORDERS, {
        variables: {
            input: user.id
        }
    });



    const renderStatus = (order: OrderEntity) => {
        switch (order.status) {
            case "PENDING":
                return <Tag icon={<ExclamationCircleOutlined />} color="processing">
                    ORDERED
                </Tag>
            case "COMPLETED":
                return <Tag icon={<CheckCircleOutlined />} color="success">
                    COMPLETED
                </Tag>
            case "CANCELED":
                return <Tag icon={<CloseCircleOutlined />} color="error">
                    CANCELED
                </Tag>
            case "SHIPPING":
                return <Tag icon={<SyncOutlined spin />} color="processing">
                    SHIPPING
                </Tag>
            case "SHIPPED":
                return <Tag icon={<CarOutlined />} color="gold">
                    SHIPPED
                </Tag>
            default:
                return;
        }
    }

    return (
        error || loading ? <Loading /> :
            <div className="p-4">
                {data.orders.map((order: OrderEntity) => (
                    <div key={order.id} className="border p-4 mb-4 bg-white shadow-sm rounded-l hover:bg-slate-200 duration-300">
                        <Link to={`/${pages.ORDER}/${order.id}`}>
                            <div className="flex justify-between items-center px-32">
                                <div className="font-bold">ID of Order: {order.id}</div>
                                <div className="font-bold">Address: {order.address}</div>
                                <div className="font-bold">Name: {order.firstName} {order.lastName}</div>
                                <div className="font-bold">Phone: {order.phone}</div>
                            </div>
                            <div className="grid grid-cols-5">
                                <div className="col-span-4">
                                    <div className="grid grid-cols-4 mt-4 justify-between">
                                        {order.orderItems.map((orderItem) => {
                                            return <div key={orderItem.id} className="ml-4 flex-1">
                                                <div className="font-bold">
                                                    <div className="flex">{orderItem.book.title}</div>
                                                    <span className="font-light">x{orderItem.quantity}</span>
                                                    <div className="flex mt-2">
                                                        <div className="text-gray-500 line-through me-16">${(Number(orderItem.book.price) * Number(orderItem.quantity)).toFixed(2)}</div>
                                                        <div className="me-16"> -{orderItem.book.discount}%</div>
                                                        <div className="text-red-500 font-bold">${(orderItem.price * orderItem.quantity).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mt-2">
                                    {
                                        renderStatus(order)
                                    }
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div >
    )
}

export default Order;
