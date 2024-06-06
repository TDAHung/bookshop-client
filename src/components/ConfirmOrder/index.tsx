import { Button } from "antd";
import { useEffect } from "react";
import { PromotionEntity } from "../../types/promotion";


interface CartItemProps {
    quantity: number
    book: {
        price: number;
        discount: number;
        quantity: number;
        promotion: PromotionEntity;
    },
}

interface Props {
    cartItems: CartItemProps[],
    setOrderTotal: React.Dispatch<React.SetStateAction<number>>,
    orderTotal: number,
    submit: () => void,
    setQuantityTotal: React.Dispatch<React.SetStateAction<number>>,
    quantityTotal: number
}

const ConfirmOrder = (
    { cartItems, setOrderTotal, orderTotal, submit, setQuantityTotal, quantityTotal }: Props

) => {
    useEffect(() => {
        let total = 0;
        let totalQuantity = 0;
        cartItems.forEach(({ book, quantity }) => {
            totalQuantity += quantity;
            if (book?.promotion?.type) {
                if (book.promotion.type.saleType == "samePrice")
                    total += Number(book.promotion.type.saleValue);
                else total += ((book.price * quantity) - (book.price * quantity) * (Number(book.promotion.type.saleValue) / 100));
            } else {
                total += ((book.price * quantity) - (book.price * quantity) * (book.discount / 100));
            }
        });
        setQuantityTotal(totalQuantity);
        setOrderTotal(total);
    }, []);

    return (
        <div>
            <h3 className="font-bold text-lg mb-4">Summary</h3>
            <div className="flex justify-between mb-2">
                <span>Total Books</span>
                <span>{quantityTotal}</span>
            </div>
            <div className="flex justify-between mb-4 font-bold items-center">
                <span>Total amount (including VAT)</span>
                <span className="text-2xl">${orderTotal.toFixed(2)}</span>
            </div>

            <Button
                onClick={submit}
                className="w-full bg-indigo-500 text-white">
                CONFIRM
            </Button>
        </div>
    );
};

export default ConfirmOrder;
