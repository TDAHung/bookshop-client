import { gql, useQuery } from "@apollo/client";
import { Loading } from "../../../../components/Loading";
import { BookEntity } from "../../../../types/books";
import CardBook from "../../../../components/CardBook";

const GET_BOOK_AUTHORS = gql`
    query findBooks($authors: [String!]!, $except: String!){
    booksBasedOnCategoriesOrAuthor(authors: $authors, except: $except){
        id
        price,
        title,
        discount,
        quantity,
        avgRating,
        images{
            key,
            name,
            size,
            url
        },
    }
}
`;

const BookRelatedAuthor = ({ idAuthors, id }: { idAuthors: Array<string>, id: string | undefined }) => {

    const { loading, error, data } = useQuery(GET_BOOK_AUTHORS, {
        variables: {
            authors: idAuthors,
            except: id
        }
    });

    const renderBooks = () => {
        if (error) return <p>{error.message}</p>
        if (loading) return <Loading />
        return data.booksBasedOnCategoriesOrAuthor.map((book: BookEntity) => {
            return <CardBook key={book.id} book={book} />
        })
    }

    return (
        error ? <p>{error?.message}</p> :
            loading ? <Loading /> :
                <div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                        Books Related to Authors
                    </div>
                    <div className="grid grid-cols-6 gap-8 px-16">
                        {renderBooks()}
                    </div>
                </div>
    )
}

export default BookRelatedAuthor;
