import { Link, useLocation } from "react-router-dom";
import { pages } from "../../utils/constant";
import './style.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "../Loading";
import { Badge } from "antd";
import CartPopUp from "../CartPopUp";
import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../contexts/authContext";


const ALL_CATEGORIES = gql`
query{
categories{
    id,
    name,
    description,
}
}
`;

const Header = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { loading, error, data } = useQuery(ALL_CATEGORIES);
    const location = useLocation();
    const user = useContext(AuthContext);

    const renderCategories = () => {
        if (loading) return <Loading />
        if (error) return <p>{error.message}</p>
        return data.categories.map((category: any) => (
            <li key={category.id} className="rounded-md">
                <Link to={`${pages.CATEGORY}/${category.id}`} className="block p-2 text-gray-700">
                    {category.name}
                </Link>
            </li>
        ));
    }

    const path = location.pathname.split('/');
    return (
        <header className="px-32 flex justify-between items-center py-8 pb-16 relative">
            <div className="project__name font-extrabold text-5xl">
                Bookshop
            </div>
            <nav>
                <ul className="flex font-bold text-lg">
                    <li className={`mx-8 nav__link rounded-xl ${path[1] === '' ? 'active' : ''}`}>
                        <Link to={pages.HOME}>Home</Link>
                    </li>
                    <li className={`mx-8 nav__link rounded-xl ${path[1] === pages.AUTHOR ? 'active' : ''}`}>
                        <Link to={pages.AUTHOR}>Author</Link>
                    </li>
                    <li
                        className={`mx-8 nav__link rounded-xl ${path[1] === pages.CATEGORY ? 'active' : ''}`}
                        onMouseEnter={() => setDropdownVisible(true)}
                        onMouseLeave={() => setDropdownVisible(false)}
                    >
                        <Link to={pages.CATEGORY}>Categories</Link>
                        <div className={`categories absolute mt-2 duration-300 z-30 ${isDropdownVisible ? 'active' : ''
                            }`}>
                            <ul className="wrapper bg-white shadow-lg rounded-xl mx-auto grid grid-cols-4 gap-4 p-4">
                                {renderCategories()}
                            </ul>
                        </div>
                    </li>
                    <li className={`mx-8 nav__link rounded-xl ${path[1] === pages.BOOK ? 'active' : ''}`}>
                        <Link to={pages.BOOK}>Book</Link>
                    </li>
                </ul>
            </nav>
            <div className="flex">
                <CartPopUp id={user?.id} />
                <div className="login__button text-2xl rounded-xl ms-4 text-center">
                    {
                        user ? <Link to={pages.ORDERS} className="">{user.firstName} {user.lastName}</Link> : <Link to={pages.LOGIN}>
                            <FontAwesomeIcon icon={faPersonWalking} />
                            <span className="ms-4">Login</span>
                        </Link>
                    }
                </div>
            </div>
        </header>
    );
}

export default Header;
