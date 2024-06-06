import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReviewEntity } from "../../../../types";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { Button, Input, message, Empty } from "antd";
import { Rating } from 'react-simple-star-rating'
import { useContext, useState } from 'react'
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT, GET_BOOK } from "../../query";
import { AuthContext } from "../../../../contexts/authContext";

const { TextArea } = Input;

interface Props {
    reviews: Array<ReviewEntity>,
    id: number
}

const calculateRatings = (reviews: Array<ReviewEntity>) => {
    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    const averageRating = (sumRatings / totalReviews) ? (sumRatings / totalReviews) : 0;

    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
        distribution[5 - Math.ceil(Number(review.rating))] += 1;
    });

    const percentageDistribution = distribution.map(count => ({
        stars: count,
        percentage: ((count / totalReviews) * 100) ? (count / totalReviews) * 100 : 0
    }));

    return { averageRating, totalReviews, percentageDistribution };
};

const BookReview = ({ reviews, id }: Props) => {
    const { averageRating, totalReviews, percentageDistribution } = calculateRatings(reviews);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState<string>("");
    const [createComment] = useMutation(CREATE_COMMENT, {
        refetchQueries: [{
            query: GET_BOOK, variables: {
                input: id
            }
        }]
    });

    const user = useContext(AuthContext);

    const handleRating = (rate: number) => {
        setRating(rate)
    }

    const renderStars = (rating: number) => {
        const finalRating = rating;
        const fullStars = Math.floor(finalRating);
        const halfStar = finalRating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-500" />
                ))}
                {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStarEmpty} className="text-yellow-500" />
                ))}
            </>
        );
    };

    const formatDateTime = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleCreateComment = async () => {
        try {
            await createComment({
                variables: {
                    input: {
                        rating,
                        comment,
                        bookId: id,
                        userId: user.id
                    }
                }
            });
            setComment('');
            setRating(0);
            message.success("comment OK");
        } catch (error) {
            console.error(error);
            message.error("cannot comment");
        }

    }

    return (

        <div>
            <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                Books Reviews
            </div>
            <div className="grid grid-cols-2 gap-16">
                <div className="my-4 ps-16">
                    <div className="text-3xl font-semibold">{averageRating.toFixed(1)}/5</div>
                    <div className="flex items-center">
                        {renderStars(averageRating)}
                        <span className="ml-2 text-gray-600">({totalReviews} reviews)</span>
                    </div>
                    <div className="mt-4">
                        {percentageDistribution.map((dist, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-8 text-gray-600 flex justify-between">
                                    <span>{5 - index}</span>
                                    <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-500" />
                                </div>
                                <div className="w-full h-4 bg-gray-200 rounded mx-2 relative">
                                    <div
                                        className="h-4 bg-yellow-500 rounded duration-300"
                                        style={{ width: `${dist.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="w-12 text-right text-gray-600">{dist.percentage.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-8">
                    {
                        user ? <div>
                            <div className="flex justify-between items-center w-full">
                                <Rating
                                    allowFraction
                                    onClick={handleRating}
                                    showTooltip
                                    tooltipArray={[
                                        'Terrible',
                                        'Terrible+',
                                        'Bad',
                                        'Bad+',
                                        'Average',
                                        'Average+',
                                        'Great',
                                        'Great+',
                                        'Awesome',
                                        'Awesome+'
                                    ]}
                                    SVGclassName={`inline-block`}
                                    transition
                                    size={25}
                                />
                                <Button className="bg-violet-500 text-white text-xl me-80" onClick={handleCreateComment}>
                                    Comment
                                </Button>
                            </div>
                            <div>
                                <label htmlFor="">Write a Comment:  </label>
                                <TextArea rows={3} value={comment} onChange={(value) => {
                                    setComment(value.target.value)
                                }} />
                            </div>
                        </div> :
                            <div className="flex justify-center items-center h-full text-2xl">
                                You need to login to Comment
                            </div>
                    }
                </div>
            </div>
            {
                reviews.length == 0 ?
                    <div>
                        <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                            Books Comments
                        </div>
                        <div className="flex justify-center">
                            <Empty
                                description={
                                    <span>
                                        There are no Comments
                                    </span>
                                } />
                        </div>
                    </div>
                    : <div>
                        <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                            Books Comments
                        </div>
                        <div className="my-4 ps-16">
                            <div className="w-full mx-auto mt-8 text-xl">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white p-4 rounded-lg shadow mb-4">
                                        <div className="flex items-center mb-2">
                                            <div className="flex-1">
                                                <div className="font-semibold">{review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous'}</div>
                                                {renderStars(Number(review.rating))} {review.rating} / 5
                                            </div>
                                            <div className="text-gray-600 text-sm">Reviewed on {formatDateTime(review.createdAt)}</div>
                                        </div>
                                        <div className="text-gray-800">{review.comment}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
            }

        </div>

    );
}
export default BookReview;
