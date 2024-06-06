import 'antd/dist/reset.css';
import { useQuery } from '@apollo/client';
import { Loading } from '../../../components/Loading';
import { ImageEntity } from '../../../types/image';
import { Link } from 'react-router-dom';
import { pages } from '../../../utils/constant';
import { GET_BOOKS } from '../query';

const PopularBook = () => {
    const displayPopularBook = () => {
        const { loading, error, data } = useQuery(GET_BOOKS, {
            variables: {
                limit: 8,
                sortBy: [
                    {
                        "field": "reviews",
                        "order": "asc"
                    }
                ]
            }
        });
        if (loading) return <Loading />
        if (error) return <p>{error.message}</p>
        return data.books.map(({ id, title, images }: { id: number, title: string, images: Array<ImageEntity> }) => (
            <div key={id} className='h-80'>
                <Link to={`${pages.BOOK}/${id}`} className=''>
                    <img className='h-full rounded-xl' src={images[0].url} alt="" />
                </Link>
            </div>
        ));
    }

    return (
        <div className="bg-gradient-to-b from-red-500 to-blue-500 my-4 py-4 px-12 rounded-xl">
            <div className='grid grid-cols-5 gap-4'>
                <div className='relative col-span-2'>
                    <div className='absolute bottom-0'>
                        <h2 className="text-4xl font-semibold text-purple-900 mb-4">Our Popular Books</h2>
                        <p className="text-purple-700 mb-8 text-lg">Most Stars</p>
                    </div>
                </div>
                <div className='col-span-3'>
                    <div className="grid grid-cols-4 gap-16">
                        {displayPopularBook()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopularBook;
