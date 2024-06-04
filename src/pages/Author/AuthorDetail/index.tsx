import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { BookEntity } from "../../../types/books";
import CardBook from "../../../components/CardBook";

const GET_AUTHOR = gql`
query showOne($input: Int!){
    author(id: $input){
        id,
        firstName,
        lastName,
        bio,
        thumpnail{
            key,
            name,
            url,
            size
        }
    }
}
`;

const GET_BOOK = gql`
query showAll($limit: Float!, $filter: [FilterBy!]!, $search: [SearchBy!]!){
    books(limit: $limit, filter: $filter, search: $search){
        id,
        price,
        title,
        description,
        quantity,
        discount
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


const AuthorDetail = () => {
    const { id } = useParams();

    const author = useQuery(GET_AUTHOR, {
        variables: {
            input: Number(id),

        }
    });

    const books = useQuery(GET_BOOK, {
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
                    field: "authors",
                    in: [
                        Number(id)
                    ]
                }
            ]
        }
    });

    const displayBook = () => {
        if (books.loading) return <Loading />
        if (books.error) return <p>{books.error.message}</p>
        return books.data.books.map((book: BookEntity) => {
            return <CardBook book={book} />
        })
    }

    return (
        author.error ? <p>{author.error.message}</p> :
            author.loading ? <Loading /> :
                <div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500">
                        Author
                    </div>
                    <div className="flex ms-48 items-center text-xl">
                        <div className="me-12 h-36 w-36">
                            <img className="h-full rounded-full" src={author.data.author.thumpnail.url} alt={author.data.author.name} />
                        </div>
                        <div className="text-center me-12">
                            {author.data.author.firstName} {author.data.author.lastName}
                        </div>
                        <a href={author.data.author.bio} target="_blank" className="text-center">
                            {author.data.author.bio}
                        </a>
                    </div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500">
                        Books
                    </div>
                    <div className="grid grid-cols-6 gap-8 px-16 my-8">
                        {displayBook()}
                    </div>
                </div>
    )
}

export default AuthorDetail;
