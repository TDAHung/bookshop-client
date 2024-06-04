import { Carousel } from "antd"
import { BookEntity, ImageEntity } from "../../types"
import { Link } from "react-router-dom"
import { pages } from "../../utils/constant"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons"
import CartButton from "../CartButton"
import { CHECK_CART } from "../CartButton/query"
import { useQuery } from "@apollo/client"

const CardBook = ({ userId, book }: { userId: number, book: BookEntity }) => {

    const { loading, error, data } = useQuery(CHECK_CART, { variables: { id: userId } });


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

    return <div key={book.id} className="relative">
        <Carousel
            className="h-full shadow-lg"
            autoplay={true}
        >
            {
                book.images.map((image: ImageEntity) => {
                    return <div key={image.key}>
                        <img src={image.url} className="h-80 rounded-2xl" alt="" />
                    </div>
                })
            }
        </Carousel>
        <div className="my-4 text-xl">
            <div className="h-16">
                <Link to={`/${pages.BOOK}/${book.id}`} >
                    {book.title}
                </Link>
            </div>
            <div className="text-base text-red-500">
                {
                    Number(book.discount) == 0 ? <div className="me-4 p-2 text-xl">
                        {book.price} USD
                    </div> : <div className="flex items-center">
                        <div className="me-4 text-xl">
                            {(Number(book.price) - Number(book.price) * Number(book.discount) / 100).toFixed(2)} USD
                        </div>
                        <div className="me-4 line-through">
                            {book.price} USD
                        </div>
                        <div className="bg-red-500 text-white p-2 rounded-xl">
                            -{book.discount}%
                        </div>
                    </div>
                }
            </div>
            <div className="text-base text-yellow-400">
                {renderStarRating(Number(book.avgRating))} {Number(book.avgRating) || '0'}/5
            </div>
            <div className="text-base">
                quantity: {book.quantity}
            </div>
        </div>
        {
            !loading ? <CartButton userId={userId} bookId={book.id} cartId={data?.cart?.id} /> : null
        }

    </div>
}
export default CardBook;
