import { useMutation, useQuery } from "@apollo/client";
import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_ORDER } from "../mutation";
import { pages } from "../../../utils/constant";
import ConfirmOrder from "../../../components/ConfirmOrder";
import { useCookies } from "react-cookie";
import OrderItemCookie from "../../../components/OrderItemCookie";

const OrderConfirmCookie = () => {
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [quantityTotal, setQuantityTotal] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<[]>([]);
    const [createOrder, order] = useMutation(CREATE_ORDER);
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();
    const [cookie, setCookie, removeCookie] = useCookies(['cart']);

    useEffect(() => {
        if (cookie.cart) {
            console.log(cookie.cart);
            setOrderItems(cookie.cart.map((cartItem: any) => {
                let finalPrice = 0;
                if (cartItem.book.promotion) {
                    if (cartItem.book.promotion.saleType == 'samePrice') finalPrice = Number(cartItem.book.promotion.saleValue);
                    else {
                        finalPrice = Number((cartItem.book.price - (cartItem.book.price * (cartItem.book.promotion.saleValue / 100))).toFixed(2))
                    }
                } else {
                    finalPrice = Number((cartItem.book.price - (cartItem.book.price * (cartItem.book.discount / 100))).toFixed(2));
                }
                return {
                    quantity: cartItem.quantity,
                    bookId: cartItem.book.id,
                    price: finalPrice
                }
            }));
        }
    }, [])

    const renderOrderItems = () => {
        return cookie.cart.map((cartItem: any) => {
            return <OrderItemCookie
                key={cartItem.id}
                cartItem={cartItem}
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
                message.success('Your Order Is Completed');
                setTimeout(() => {
                    removeCookie('cart');
                    navigate(`/${pages.BOOK}`);
                }, 1000);
            } catch (error) {
                console.log(error);
            }

        }

    };

    const submit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }

    return (
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
                        />
                        <Input
                            placeholder="Last Name"
                            className="flex-1"
                            size="large"
                            name="lastName"
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
                        cartItems={cookie.cart}
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

export default OrderConfirmCookie;
