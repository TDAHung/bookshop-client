import { gql, useQuery } from "@apollo/client";
import { Loading } from "../../../../components/Loading";
import { BookEntity } from "../../../../types/books";
import CardBook from "../../../../components/CardBook";
import { GET_BOOKS } from "../../query";
import { useAuth } from "../../../../contexts/authProvider";
import { Empty } from "antd";

const BookRelatedAuthor = ({ idAuthors, id }: { idAuthors: Array<string>, id: string | undefined }) => {
    const { getUser } = useAuth();

    const { loading, error, data } = useQuery(GET_BOOKS, {
        variables: {
            limit: 6,
            page: 1,
            filter: {
                field: "authors",
                in: idAuthors.map(Number)
            },
            sortBy: [],
            except: id
        }
    });

    const renderBooks = () => {
        if (error) return <p>{error.message}</p>
        if (loading) return <Loading />
        return data.books.map((book: BookEntity) => {
            return <CardBook userId={getUser().id} key={book.id} book={book} />
        })
    }

    return (
        error ? <p>{error?.message}</p> :
            loading ? <Loading /> :
                <div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                        Books Related to Authors
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

export default BookRelatedAuthor;
