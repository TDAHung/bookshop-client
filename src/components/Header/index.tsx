import { Link, useLocation } from "react-router-dom";
import { pages } from "../../utils/constant";
import './style.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "../Loading";
import { Avatar, Badge, Button, Space } from "antd";


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
                {/* <div className="login__button text-2xl rounded-xl"> */}
                <Badge count={5} className="login__button text-2xl rounded-xl" style={{ backgroundColor: '#52c41a' }}>
                    <Link to={pages.LOGIN}>
                        <FontAwesomeIcon icon={faCartArrowDown} />
                        <span className="ms-4">Cart</span>
                    </Link>
                </Badge>
                {/* </div> */}
                <div className="login__button text-2xl rounded-xl ms-4">
                    <Link to={pages.LOGIN}>
                        <FontAwesomeIcon icon={faPersonWalking} />
                        <span className="ms-4">Login</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
