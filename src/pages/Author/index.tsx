import { gql, useQuery } from "@apollo/client";
import { Loading } from "../../components/Loading";
import { AuthorEntity } from "../../types/authors";
import { Link } from "react-router-dom";
import { pages } from "../../utils/constant";

const GET_AUTHOR = gql`
    query{
    authors{
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

const Author = () => {
    const { loading, error, data } = useQuery(GET_AUTHOR);
    const displayAuthors = () => {
        return data.authors.map(({ id, firstName, lastName, bio, thumpnail }: AuthorEntity) => {
            return <div key={id} className="hover:bg-slate-100">
                <Link to={`/${pages.AUTHOR}/${id}`}>
                    <div key={thumpnail.key}>
                        <img src={thumpnail.url} className="h-96 rounded-2xl" alt="" />
                    </div>
                    <div className="my-4 text-2xl">
                        <div className="flex justify-center">
                            {firstName} {lastName}
                        </div>
                        <div className="text-center text-base">
                            {bio}
                        </div>
                    </div>
                </Link>
            </div>
        });
    }

    return (
        error ? <p>{error.message}</p> :
            loading ? <Loading /> :
                <div className="grid grid-cols-6 gap-8">
                    {displayAuthors()}
                </div>
    )
}

export default Author;
