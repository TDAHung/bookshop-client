import { Button } from "antd";
import { pages } from "../../utils/constant";
import { Link } from "react-router-dom";
import { PromotionEntity } from "../../types/promotion";


interface CartItemProps {
    quantity: number
    book: {
        price: number;
        discount: number;
        quantity: number;
        promotion: PromotionEntity
    }
}

const Checkout = ({ cartItems }: { cartItems: CartItemProps[] }) => {
    let total = 0;
    cartItems.forEach(({ book, quantity }) => {
        if (book.promotion?.type) {
            if (book.promotion.type.saleType == "samePrice")
                total += Number(book.promotion.type.saleValue);
            else total += ((book.price * quantity) - (book.price * quantity) * (Number(book.promotion.type.saleValue) / 100));
        } else {
            total += ((book.price * quantity) - (book.price * quantity) * (book.discount / 100));
        }
    });
    return (
        <div>
            <h3 className="font-bold text-lg mb-4">Summary</h3>
            <div className="flex justify-between mb-2">
                <span>Products</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 font-bold">
                <span>Total amount (including VAT)</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <Button className="w-full bg-indigo-500 text-white">
                <Link to={`/${pages.ORDER}`}>
                    GO TO CHECKOUT
                </Link>
            </Button>
        </div>
    );
};

export default Checkout;
