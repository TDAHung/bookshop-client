import { Carousel } from "antd";
import { ImageEntity } from "../../types";

const OrderItemCookie: React.FC<any> = ({ cartItem }) => {
    console.log(cartItem);
    const renderPrice = () => {
        if (cartItem.book.promotion?.type) {
            if (cartItem.book.promotion.type.saleType == "samePrice") {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(cartItem.book.promotion.type.saleValue) * cartItem.quantity)}
                    </div>
                    <div className="me-4 line-through">
                        ${cartItem.book.price}
                    </div>
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(cartItem.book.price * cartItem.quantity) - Number(cartItem.book.price * cartItem.quantity) * Number(cartItem.book.promotion.type.saleValue) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        ${Number(cartItem.book.price) * cartItem.quantity}
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-xl">
                        -{cartItem.book.promotion.type.saleValue}%
                    </div>
                </div>
            }
        } else {
            if (Number(cartItem.discount) == 0) {
                return <div className="me-4 p-2 text-xl">
                    ${cartItem.book.price * cartItem.quantity}
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-xl text-red-500">
                        ${(Number(cartItem.book.price * cartItem.quantity) - Number(cartItem.book.price * cartItem.quantity) * Number(cartItem.book.discount) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        ${(cartItem.book.price * cartItem.quantity).toFixed(2)}
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
            <div key={cartItem.id} className="grid grid-cols-3 gap-4 m-4 items-center">
                <div className="col-span-1">
                    <Carousel className="shadow-lg">
                        {
                            cartItem.book.images.map((image: ImageEntity) => {
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
                        <span className="text-lg"> {cartItem.book.title}</span>
                    </div>
                    <div className="text-sm">
                        Quantity:
                        <span className="text-lg"> {cartItem.quantity}</span>
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

export default OrderItemCookie;
