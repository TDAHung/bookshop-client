import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { BookEntity } from "../../../types/books";
import CardBook from "../../../components/CardBook";
import { GET_BOOKS, GET_CATEGORY } from "../query";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";
import { Empty } from 'antd'

const CategoryDetail = () => {
    const { id } = useParams();
    const user = useContext(AuthContext);

    const category = useQuery(GET_CATEGORY, {
        variables: {
            input: Number(id),

        }
    });

    const books = useQuery(GET_BOOKS, {
        variables: {
            limit: 10,
            search: [
                {
                    field: "title",
                    contains: ''
                }
            ],
            filter: [
                {
                    field: "categories",
                    in: [
                        Number(id)
                    ]
                }
            ]
        }
    });

    const displayCategory = () => {
        if (books.error || books.loading) return <Loading />
        if (books.data.books.length == 0) return <div className="flex justify-center">
            <Empty
                description={
                    <span>
                        There are no books
                    </span>
                }
            />
        </div>
        return <div className="grid grid-cols-6 gap-8 px-16">
            {books.data.books.map((book: BookEntity) => {
                return <CardBook userId={user.id} book={book} key={book.id} />
            })}
        </div>
    }
    return (
        category.error ? <p>{category.error.message}</p> :
            category.loading ? <Loading /> :
                <div>
                    <div className="w-3/4 h-96 mx-auto mb-56">
                        <img className="h-full" src={category.data.category.banner} alt="" />
                        <div className="my-8 text-xl" style={{
                            color: `${category.data.category.bannerColor}`
                        }}>
                            <div className="text-6xl font-bold mb-4">
                                {category.data.category.name}
                            </div>
                            <div className="font-light">
                                {category.data.category.description}
                            </div>
                        </div>
                    </div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                        Books
                    </div>
                    {displayCategory()}

                </div>
    );
}

export default CategoryDetail;
