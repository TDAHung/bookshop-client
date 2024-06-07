import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Carousel, InputNumber, message } from "antd";
import { ImageEntity } from "../../types";
import { useState } from "react";
import { PromotionEntity } from "../../types/promotion";
import { useCookies } from "react-cookie";

const CartItemCookie: React.FC<any> = ({ cartItem, index }) => {
    const [quantityUpdate, setQuantityUpdate] = useState<number>(cartItem.quantity);
    const [cookie, setCookie, removeCookie] = useCookies(['cart']);

    const handleUpdateQuantity = async (value: number | null) => {
        if (Number(value) > cartItem.book.quantity && value != null) {
            message.error("Quantity is higher than Our book quantity");
            return;
        }
        try {
            const cart = cookie.cart;
            cart[index].quantity = quantityUpdate;
            setCookie('cart', cart, { path: "/", maxAge: 3600 * 24, secure: true, sameSite: "strict" })
            setQuantityUpdate(Number(value));
        } catch (error) {
            message.error("Failed to update quantity");
        }
    }

    const handleDeleteCartItem = async (id: number) => {
        try {
            const cart = cookie.cart;
            cart.splice(index, 1);
            setCookie('cart', cart, { path: "/", maxAge: 3600 * 24, secure: true, sameSite: "strict" })
            message.success("Cart item deleted successfully");
        } catch (error) {
            message.error("Failed to delete cart item");
        }
    }

    const renderPrice = () => {
        if (cartItem.book.promotion?.type) {
            if (cartItem.book.promotion.type.saleType == "samePrice") {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(cartItem.book.promotion.type.saleValue) * quantityUpdate)}
                    </div>
                    <div className="me-4 line-through">
                        ${cartItem.book.price}
                    </div>
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(cartItem.book.price * quantityUpdate) - Number(cartItem.book.price * quantityUpdate) * Number(cartItem.book.promotion.type.saleValue) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        ${(Number(cartItem.book.price) * quantityUpdate).toFixed(2)}
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-xl">
                        -{cartItem.book.promotion.type.saleValue}%
                    </div>
                </div>
            }
        } else {
            if (Number(cartItem.book.discount) == 0) {
                return <div className="me-4 p-2 text-xl">
                    ${cartItem.book.price * quantityUpdate}
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(cartItem.book.price * quantityUpdate) - Number(cartItem.book.price * quantityUpdate) * Number(cartItem.book.discount) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        ${(Number(cartItem.book.price) * quantityUpdate).toFixed(2)}
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-xl">
                        -{cartItem.book.discount}%
                    </div>
                </div>
            }
        }
    }

    return (
        <div className="border-b-2 border-indigo-500">
            <div key={index} className="grid grid-cols-3 gap-4 m-4 items-center">
                <div className="grid-span-3">
                    <Carousel className="shadow-lg" autoplay={true}>
                        {
                            cartItem.book.images.map((image: ImageEntity) => {
                                return <div key={image.key}>
                                    <img src={image.url} className="h-48 rounded-2xl" alt={image.name} />
                                </div>
                            })
                        }
                    </Carousel>
                </div>

                <div className="my-4 text-xl flex flex-col h-full py-4 justify-between">
                    <h3 className="font-bold text-lg">{cartItem.book.title}</h3>
                    <Button
                        className="bg-red-500 text-white mb-2"
                        onClick={() => { handleDeleteCartItem(index) }}
                        icon={<FontAwesomeIcon icon={faTrash} />}
                    />
                </div>
                <div>
                    <div className="m-2">
                        <InputNumber
                            onChange={(value) => { handleUpdateQuantity(value) }}
                            size="small"
                            min={1}
                            defaultValue={quantityUpdate}
                            value={quantityUpdate}
                        />
                    </div>
                    <div className="text-base">
                        {
                            renderPrice()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCookie;
