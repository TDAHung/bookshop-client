import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { Button, Carousel, InputNumber } from "antd";
import { AuthorEntity } from "../../../types/authors";
import { ImageEntity } from "../../../types/image";
import './style.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import BookRelatedCategory from "./BookRelatedCategory";
import BookRelatedAuthor from "./BookRelatedAuthor";
import BookReview from "./BookReview";
import { GET_BOOK } from "../query";

const BookDetail = () => {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_BOOK, {
        variables: {
            input: Number(id)
        }
    });

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
        return avgRating / data.book.reviews.length;
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
                        <div className="col-span-4 py-8">
                            <h1 className="text-4xl font-bold mb-12">{data.book.title}</h1>
                            <p className="text-gray-500 text-2xl mb-4">Authors: {renderAuthor()}</p>
                            <p className="text-gray-500 text-2xl mb-4">Categories: {renderCategories()}</p>
                            <p className="text-gray-500 text-2xl mb-4">Description: {data.book.description}</p>

                            <p className="text-xl mb-4 text-yellow-500">{renderStarRating(calculateAvgRating())} {calculateAvgRating() || '0'}/5</p>

                            <div className="text-red-500 text-xl mt-4 mb-4">
                                {
                                    Number(data.book.discount) == 0 ? <span className="text-4xl me-4">
                                        {data.book.price} USD
                                    </span> : <div className="flex items-center">
                                        <div className="text-4xl me-4">
                                            {(Number(data.book.price) - Number(data.book.price) * Number(data.book.discount) / 100).toFixed(2)} USD
                                        </div>
                                        <div className="me-4 line-through">
                                            {data.book.price} USD
                                        </div>
                                        <div className="bg-red-500 text-white p-2 rounded-xl">
                                            -{data.book.discount}%
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="flex items-center mb-4 text-lg">
                                <span className="mr-4">Quantity: </span>
                                <InputNumber min={1} defaultValue={1} />
                            </div>
                            <div className="flex space-x-4">
                                <Button className="bg-indigo-500 text-white">Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                    <BookRelatedCategory idCategories={idCategories()} id={id} />
                    <BookRelatedAuthor idAuthors={idAuthors()} id={id} />
                    <BookReview reviews={data.book.reviews} />
                </div>
    )
}

export default BookDetail;
