import { Carousel } from "antd";
import { ImageEntity } from "../../types";
import { PromotionEntity } from "../../types/promotion";

interface CartItemProps {
    cartItemId: number;
    bookId: number;
    title: string;
    price: number;
    discount: number;
    images: ImageEntity[];
    quantity: number;
    promotion: PromotionEntity
}

const OrderItem: React.FC<CartItemProps> = ({ cartItemId, title, price, discount, images, quantity, promotion }) => {

    const renderPrice = () => {
        if (promotion?.type) {
            if (promotion.type.saleType == "samePrice") {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(promotion.type.saleValue) * quantity)}
                    </div>
                    <div className="me-4 line-through">
                        ${price}
                    </div>
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(price * quantity) - Number(price * quantity) * Number(promotion.type.saleValue) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        ${Number(price) * quantity}
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-xl">
                        -{promotion.type.saleValue}%
                    </div>
                </div>
            }
        } else {
            if (Number(discount) == 0) {
                return <div className="me-4 p-2 text-xl">
                    ${price * quantity}
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
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
        }
    }

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
                            renderPrice()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
