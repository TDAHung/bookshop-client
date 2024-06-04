import { Carousel } from "antd";
import { ImageEntity } from "../../types";

interface CartItemProps {
    cartItemId: number;
    bookId: number;
    title: string;
    price: number;
    discount: number;
    images: ImageEntity[];
    quantity: number;
}

const OrderItem: React.FC<CartItemProps> = ({ cartItemId, title, price, discount, images, quantity }) => {
    return (
        <div className="border-b-2 border-indigo-500">
            <div key={cartItemId} className="grid grid-cols-3 gap-4 m-4 items-center">
                <div className="col-span-1">
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
                <div className="col-span-2">
                    <div className="text-sm">
                        Name:
                        <span className="text-lg"> {title}</span>
                    </div>
                    <div className="text-sm">
                        Quantity:
                        <span className="text-lg"> {quantity}</span>
                    </div>
                    <div className="text-base text-red-500">
                        {
                            Number(discount) == 0 ? <div className="me-4 p-2 text-2xl">
                                ${price * quantity}
                            </div> : <div className="flex items-center">
                                <div className="me-4 text-2xl">
                                    ${(Number(price * quantity) - Number(price * quantity) * Number(discount) / 100).toFixed(2)}
                                </div>
                                <div className="me-4 line-through">
                                    ${(price * quantity).toFixed(2)}
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

export default OrderItem;
