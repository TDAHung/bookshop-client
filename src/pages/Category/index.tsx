import { useQuery } from "@apollo/client";
import { Loading } from "../../components/Loading";
import { CategoryEntity } from "../../types/category";
import { Link } from "react-router-dom";
import { GET_CATEGORIES } from "./query";

const Category = () => {

    const { loading, error, data } = useQuery(GET_CATEGORIES);

    const renderCategories = () => {
        return data.categories.map((category: CategoryEntity) => {
            return <div key={category.id} className="relative">
                <div className="bannerWrapper h-56 bg-black">
                    <Link to={`${category.id}`} >
                        <img src={category.banner} className="h-full opacity-50" alt="" />
                    </Link>
                </div>
                <div className="absolute bottom-1 ps-4 pb-4 text-3xl text-white">
                    {category.name}
                </div>
            </div>
        });
    }

    return (
        error ? <p>Error: {error.message}</p> :
            loading ? <Loading /> :
                <div>
                    <div className="px-16 text-2xl border-l-4 border-indigo-500 my-8">
                        Categories
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        {renderCategories()}
                    </div>
                </div>
    )
}

export default Category;
