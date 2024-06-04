import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Carousel, InputNumber, message } from "antd";
import { ImageEntity } from "../../types";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { DELETE_CART_ITEM, UPDATE_CART_ITEM } from "./mutation";
import { GET_CART } from "../../pages/Cart/query";

interface CartItemProps {
    userId: number;
    cartItemId: number;
    bookId: number;
    title: string;
    price: number;
    discount: number;
    images: ImageEntity[];
    quantity: number;
}


const CartItem: React.FC<CartItemProps> = ({ userId, cartItemId, title, price, discount, images, quantity }) => {

    const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
        refetchQueries: [{ query: GET_CART, variables: { id: userId } }],
    });
    const [deleteCartItem] = useMutation(DELETE_CART_ITEM, {
        refetchQueries: [{ query: GET_CART, variables: { id: userId } }],
    });
    const [quantityUpdate, setQuantityUpdate] = useState<number>(quantity);

    const handleUpdateQuantity = async (value: number | null) => {
        setQuantityUpdate(Number(value));
        try {
            await updateCartItem({
                variables: {
                    input: {
                        id: cartItemId,
                        quantity: Number(value)
                    }
                }
            });
            message.success("Quantity updated successfully");
        } catch (error) {
            message.error("Failed to update quantity");
        }
    }

    const handleDeleteCartItem = async (id: number) => {
        try {
            await deleteCartItem({
                variables: {
                    id: id
                }
            });
            message.success("Cart item deleted successfully");
        } catch (error) {
            message.error("Failed to delete cart item");
        }
    }

    return (
        <div className="border-b-2 border-indigo-500">
            <div key={cartItemId} className="grid grid-cols-3 gap-4 m-4 items-center">
                <div className="grid-span-3">
                    <Carousel className="shadow-lg">
                        {
                            images.map((image: ImageEntity) => {
                                return <div key={image.key}>
                                    <img src={image.url} className="h-48 rounded-2xl" alt={image.name} />
                                </div>
                            })
                        }
                    </Carousel>
                </div>

                <div className="my-4 text-xl flex flex-col h-full py-4 justify-between">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <Button
                        className="bg-red-500 text-white mb-2"
                        onClick={() => { handleDeleteCartItem(cartItemId) }}
                        icon={<FontAwesomeIcon icon={faTrash} />}
                    />
                </div>
                <div>
                    <div className="m-2">
                        <InputNumber
                            onChange={(value) => { handleUpdateQuantity(value) }}
                            size="small" min={1} defaultValue={quantityUpdate} />
                    </div>
                    <div className="text-base text-red-500">
                        {
                            Number(discount) == 0 ? <div className="me-4 p-2 text-2xl">
                                ${price * quantityUpdate}
                            </div> : <div className="flex items-center">
                                <div className="me-4 text-2xl">
                                    ${(Number(price * quantityUpdate) - Number(price * quantityUpdate) * Number(discount) / 100).toFixed(2)}
                                </div>
                                <div className="me-4 line-through">
                                    ${(price * quantityUpdate).toFixed(2)}
                                </div>
                                <div className="bg-red-500 text-white p-2 rounded-xl">
                                    -{discount}%
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
