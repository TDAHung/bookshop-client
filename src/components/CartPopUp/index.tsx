import { gql, useQuery } from "@apollo/client";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "antd";
import { Link } from "react-router-dom";
import { pages } from "../../utils/constant";
import { Loading } from "../Loading";
import { GET_CART } from "./query";
import { useEffect, useState } from "react";

const CartPopUp = ({ id }: { id: number }) => {
    const { loading, error, data } = useQuery(GET_CART, {
        variables: {
            id: id
        }
    });

    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        if (!error && !loading) setTotal(data.cart.cartItems.length);
    }, [loading, data, error])

    return loading ? <Loading /> :
        <Badge count={total} className="login__button text-2xl rounded-xl" style={{ backgroundColor: '#52c41a' }}>
            <Link to={pages.CART}>
                <FontAwesomeIcon icon={faCartArrowDown} />
                <span className="ms-4">Cart</span>
            </Link>
        </Badge>
}

export default CartPopUp;
