import { useMutation, useQuery } from "@apollo/client";
import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/authContext";
import { GET_CART } from "../query";
import { GET_CART as GET_CART_POPUP } from "../../../components/CartPopUp/query";
import { CREATE_ORDER, DELETE_CART } from "../mutation";
import { CHECK_CART } from "../../../components/CartButton/query";
import OrderItem from "../../../components/OrderItem";
import { pages } from "../../../utils/constant";
import { Loading } from "../../../components/Loading";
import ConfirmOrder from "../../../components/ConfirmOrder";

const OrderConfirm = () => {
    const user = useContext(AuthContext);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [quantityTotal, setQuantityTotal] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const { loading, error, data } = useQuery(GET_CART, {
        variables: {
            id: user.id
        }
    });
    const [createOrder, order] = useMutation(CREATE_ORDER);
    const [removeCart, cart] = useMutation(DELETE_CART, {
        refetchQueries: [
            { query: GET_CART_POPUP, variables: { id: user.id } },
            { query: GET_CART, variables: { id: user.id } },
            { query: CHECK_CART, variables: { id: user.id } },
        ],
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!error && !loading) {
            setOrderItems(data.cart.cartItems.map((cartItem: any) => {
                return {
                    quantity: cartItem.quantity,
                    bookId: cartItem.book.id,
                    price: Number((cartItem.book.price - (cartItem.book.price * (cartItem.book.discount / 100))).toFixed(2))
                }
            }));
        }
    }, [data])

    const renderOrderItems = () => {
        return data.cart.cartItems.map((cartItem: any) => {
            return <OrderItem
                key={cartItem.id}
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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(e.currentTarget);
            const formValues = Object.fromEntries(formData.entries());
            formValues.total = orderTotal.toString();
            formValues.quantity = quantityTotal.toString();
            try {
                await createOrder({
                    variables: {
                        createOrder: {
                            address: formValues.address,
                            firstName: formValues.firstName,
                            lastName: formValues.lastName,
                            total: orderTotal,
                            quantity: quantityTotal,
                            phone: formValues.phone,
                            email: formValues.email,
                            orderItems: orderItems
                        }
                    }
                });

                await removeCart({
                    variables: {
                        id: user.id
                    }
                });
                message.success('Your Order Is Completed');
                setTimeout(() => {
                    navigate(`/${pages.BOOK}`);
                }, 1000);
            } catch (error) {

            }

        }

    };

    const submit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }

    return (
        error || loading ? <Loading /> :
            <div className="grid grid-cols-3 gap-16 px-16 min-h-screen bg-gradient-to-b from-red-500 to-blue-500 flex items-center justify-center">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="col-span-2 bg-white p-8 rounded-xl shadow-lg"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-red-600">1. Can you enter your name?</h2>
                        <div className="flex space-x-4">
                            <Input
                                placeholder="First Name"
                                className="flex-1"
                                size="large"
                                name="firstName"
                                value={user.firstName}
                            />
                            <Input
                                placeholder="Last Name"
                                className="flex-1"
                                size="large"
                                name="lastName"
                                value={user.lastName}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-red-600">2. What's your primary email address?</h2>
                        <Input
                            placeholder="Email"
                            prefix={<FontAwesomeIcon icon={faEnvelope} />}
                            size="large"
                            name="email"
                            value={user.email}
                        />
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-red-600">3. Can we have your phone number?</h2>
                        <Input
                            placeholder="Phone Number"
                            prefix={<FontAwesomeIcon icon={faPhone} />}
                            size="large"
                            name="phone"
                        />
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-red-600">4. Where you want to get the order?</h2>
                        <Input
                            placeholder="Address"
                            prefix={<FontAwesomeIcon icon={faLocationDot} />}
                            size="large"
                            name="address"
                        />
                    </div>
                </form>

                <div className="col-span-1 bg-white p-8 rounded-xl shadow-lg">
                    <div>
                        {renderOrderItems()}
                    </div>
                    <div>
                        <ConfirmOrder
                            cartItems={data.cart.cartItems}
                            setOrderTotal={setOrderTotal}
                            orderTotal={orderTotal}
                            setQuantityTotal={setQuantityTotal}
                            quantityTotal={quantityTotal}
                            submit={submit}
                        />
                    </div>
                </div>
            </div>
    )
}

export default OrderConfirm;
