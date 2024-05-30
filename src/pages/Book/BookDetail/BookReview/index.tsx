import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReviewEntity } from "../../../../types";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";


const calculateRatings = (reviews: Array<ReviewEntity>) => {

    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    const averageRating = sumRatings / totalReviews;

    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
        distribution[5 - Math.ceil(Number(review.rating))] += 1;
    });

    const percentageDistribution = distribution.map(count => ({
        stars: count,
        percentage: (count / totalReviews) * 100
    }));

    return { averageRating, totalReviews, percentageDistribution };
};

const BookReview = ({ reviews }: { reviews: Array<ReviewEntity> }) => {
    const { averageRating, totalReviews, percentageDistribution } = calculateRatings(reviews);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
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

    return (
        reviews.length == 0 ?
            <div>
                <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                    Books Reviews
                </div>
                <div className="w-1/2 my-4 ps-16">
                    <div className="text-3xl font-semibold">None Reviews</div>
                </div>
            </div>
            :
            <div>
                <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                    Books Reviews
                </div>
                <div className="w-1/2 my-4 ps-16">
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
                                        className="h-4 bg-yellow-500 rounded"
                                        style={{ width: `${dist.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="w-12 text-right text-gray-600">{dist.percentage.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
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

    );
}
export default BookReview;
