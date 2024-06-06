import 'antd/dist/reset.css';
import { useQuery } from '@apollo/client';
import { Loading } from '../../../components/Loading';
import { ImageEntity } from '../../../types/image';
import { Link } from 'react-router-dom';
import { pages } from '../../../utils/constant';
import { GET_PROMOTIONS } from '../query';
import CardBook from '../../../components/CardBook';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/authContext';
import { BookEntity } from '../../../types';
import { PromotionEntity } from '../../../types/promotion';

const PromotionBook = () => {
    const { loading, error, data } = useQuery(GET_PROMOTIONS, {
        variables: {
            limit: 6,
            sortBy: [
                {
                    "field": "reviews",
                    "order": "desc"
                }
            ]
        }
    });
    const user = useContext(AuthContext);
    const displayPromotion = () => {
        return data.promotions.map((promotion: PromotionEntity) => {
            let content = "";
            if (promotion.type.saleType == 'samePrice') {
                content += 'Sale At Same Price: $';
                content += promotion.type.saleValue;
            } else {
                content += 'Sale At Same Discount: ';
                content += `${promotion.type.saleValue}%`;
            }

            return <div key={promotion.id}>
                <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                    {content}
                </div>
                <div className='grid grid-cols-6 gap-8'>
                    {
                        promotion.books.map((book: BookEntity) => {
                            return <CardBook
                                userId={user.id}
                                key={book.id}
                                book={book}
                            />
                        })
                    }
                </div>
            </div>
        })
    }

    return (
        error || loading ? <Loading /> :
            <div>
                {displayPromotion()}
            </div>
    )
}

export default PromotionBook;
