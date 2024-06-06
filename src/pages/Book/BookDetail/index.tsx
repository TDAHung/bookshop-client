import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { Carousel } from "antd";
import { AuthorEntity } from "../../../types/authors";
import { ImageEntity } from "../../../types/image";
import './style.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import BookRelatedCategory from "./BookRelatedCategory";
import BookRelatedAuthor from "./BookRelatedAuthor";
import BookReview from "./BookReview";
import CartButton from "../../../components/CartButton";
import { GET_BOOK } from "../query";
import { CHECK_CART } from "../../../components/CartButton/query";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";

const BookDetail = () => {
    const { id } = useParams();
    const user = useContext(AuthContext)
    const { loading, error, data } = useQuery(GET_BOOK, {
        variables: {
            input: Number(id)
        }
    });

    const cart = useQuery(CHECK_CART, { variables: { id: user?.id } });

    const idCategories = () => {
        if (loading) return null;
        return data.book.categories.map(({ category }: { category: any }) => {
            return String(category.id);
        });
    }

    const idAuthors = () => {
        if (loading) return null;
        return data.book.authors.map(({ author }: { author: AuthorEntity }) => {
            return String(author.id);
        });
    }


    const renderAuthor = () => {
        if (loading) return <Loading />;
        if (error) return <p>Error : {error.message}</p>;
        return data.book.authors.map(({ author }: { author: AuthorEntity }) => `${author.firstName} ${author.lastName}`).join(', ');
    }

    const renderCategories = () => {
        if (loading) return <Loading />
        if (error) return <p>Error: {error.message}</p>
        return data.book.categories.map(({ category }: { category: any }) => `${category.name}`).join(', ');
    }

    const renderStarRating = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
            } else if (rating > i - 1 && rating < i) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500" />);
            } else {
                stars.push(<FontAwesomeIcon key={i} icon={faStarEmpty} className="text-yellow-500" />);
            }
        }
        return stars;
    }

    const calculateAvgRating = () => {
        let avgRating: number = 0;
        data.book.reviews.forEach(({ rating }: { rating: any }) => {
            avgRating += Number(rating);
        });
        return (avgRating / data.book.reviews.length).toFixed(2);
    }

    const renderPrice = () => {
        if (data.book?.promotion?.type) {
            if (data.book.promotion.type.saleType == "samePrice") {
                return <div className="flex items-center">
                    <div className="me-4 text-3xl text-red-500">
                        ${(Number(data.book.promotion.type.saleValue))}
                    </div>
                    <div className="me-4 line-through">
                        ${data.book.price}
                    </div>
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-3xl text-red-500">
                        ${(Number(data.book.price) - Number(data.book.price) * Number(data.book.promotion.type.saleValue) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        {data.book.price}
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-xl">
                        -{data.book.promotion.type.saleValue}%
                    </div>
                </div>
            }
        } else {
            if (Number(data.book.discount)) {
                return <div className="me-4 p-2 text-xl">
                    ${data.book.price}
                </div>
            } else {
                return <div className="flex items-center">
                    <div className="me-4 text-3xl text-red-500">
                        ${(Number(data.book.price) - Number(data.book.price) * Number(data.book.discount) / 100).toFixed(2)}
                    </div>
                    <div className="me-4 line-through">
                        ${data.book.price}
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-xl">
                        -{data.book.discount}%
                    </div>
                </div>
            }
        }
    }

    return (
        error ? <p>{error.message}</p> :
            loading ? <Loading /> :
                <div>
                    <div className="grid grid-cols-7 gap-16 md:flex-row">
                        <div className="col-span-3">
                            <Carousel arrows={true} className="">
                                {
                                    data.book.images.map((image: ImageEntity) => {
                                        return <div key={image.key} className="image__wrapper">
                                            <img src={image.url} className="h-full rounded-2xl" alt="" />
                                        </div>
                                    })
                                }
                            </Carousel>
                        </div>
                        <div className="col-span-4 py-8 flex flex-col justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-12">{data.book.title}</h1>
                                <p className="text-gray-500 text-2xl mb-4">Authors: {renderAuthor()}</p>
                                <p className="text-gray-500 text-2xl mb-4">Categories: {renderCategories()}</p>
                                <p className="text-gray-500 text-2xl mb-4">Description: {data.book.description}</p>
                            </div>
                            <div className="w-1/3">
                                <p className="text-xl mb-4 text-yellow-500">{renderStarRating(Number(calculateAvgRating()))} {calculateAvgRating() || '0'}/5</p>
                                <div className="text-red-500 text-xl mt-4 mb-4">
                                    {renderPrice()}
                                </div>
                                {cart.error || cart.loading ? <Loading /> : <CartButton cartId={cart.data.cart.id} userId={user?.id} bookId={Number(id)} />
                                }
                            </div>
                        </div>
                    </div>
                    <BookRelatedCategory idCategories={idCategories()} id={id} />
                    <BookRelatedAuthor idAuthors={idAuthors()} id={id} />
                    <BookReview reviews={data.book.reviews} id={Number(id)} />
                </div>
    )
}

export default BookDetail;
