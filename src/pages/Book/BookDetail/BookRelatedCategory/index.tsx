import { useQuery } from "@apollo/client";
import { Loading } from "../../../../components/Loading";
import { BookEntity } from "../../../../types";
import CardBook from "../../../../components/CardBook";
import { GET_BOOKS } from "../../query";
import { Empty } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/authContext";

const BookRelatedCategory = ({ idCategories, id }: { idCategories: Array<string>, id: string | undefined }) => {
    const user = useContext(AuthContext);

    const { loading, error, data } = useQuery(GET_BOOKS, {
        variables: {
            limit: 5,
            page: 1,
            filter: {
                field: "categories",
                in: idCategories.map(Number)
            },
            sortBy: [],
            except: id
        }
    });

    const renderBooks = () => {
        if (error) return <p>{error.message}</p>
        if (loading) return <Loading />
        return data.books.map((book: BookEntity) => {
            return <CardBook userId={user.id} key={book.id} book={book} />
        })
    }

    return (
        error ? <p>{error?.message}</p> :
            loading ? <Loading /> :
                <div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                        Books Related to Categories
                    </div>
                    {
                        data.books.length === 0 ?
                            <div className="flex justify-center">
                                <Empty
                                    description={
                                        <span>
                                            There are no books
                                        </span>
                                    } />
                            </div>
                            : <div className="grid grid-cols-6 gap-8 px-16">
                                {renderBooks()}
                            </div>
                    }

                </div>
    )
}

export default BookRelatedCategory;
