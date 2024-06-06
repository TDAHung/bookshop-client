import { gql, useQuery } from "@apollo/client";
import { faAt, faFilter, faList, faMoneyBill, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthorEntity, BookEntity } from "../../types";
import { CategoryEntity } from "../../types/category";
import { Loading } from "../../components/Loading";
import CardBook from "../../components/CardBook";
import { useAuth } from "../../hooks/useAuth";
import { GET_AUTHORS, GET_BOOKS, GET_CATEGORIES, GET_TOTAL_BOOKS } from "./query";
import Paging from "../../components/Pagination";
import { AuthContext } from "../../contexts/authContext";

type MenuItem = Required<MenuProps>['items'][number];



const Book = () => {
    const [authorFilter, setAuthorFilter] = useState<Array<number>>([]);
    const [categoriesFilter, setCategoryFilter] = useState<Array<number>>([]);
    const [initCategories, setInitCategories] = useState<Array<number>>([]);
    const [initAuthors, setInitAuthors] = useState<Array<number>>([]);
    const [reviewFilter, setReviewFilter] = useState<Array<number>>([0, 5]);
    const [priceFilter, setPriceFilter] = useState<string>('desc');
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const user = useContext(AuthContext);
    const variables = {
        variables: {
            page,
            limit,
            sortBy: [
                {
                    field: "price",
                    order: priceFilter
                }
            ],
            filter: [
                {
                    field: "categories",
                    in: categoriesFilter
                },
                {
                    field: "authors",
                    in: authorFilter
                },
                {
                    field: "reviews",
                    in: reviewFilter
                }
            ],
            except: "-1"
        }
    }

    const totalVariables = {
        variables: {
            page,
            limit,
            sortBy: [
                {
                    field: "price",
                    order: priceFilter
                }
            ],
            filter: [
                {
                    field: "categories",
                    in: categoriesFilter
                },
                {
                    field: "authors",
                    in: authorFilter
                },
                {
                    field: "reviews",
                    in: reviewFilter
                }
            ],
            except: "-1"
        }
    }

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

    const itemsRating: MenuItem[] = [
        {
            key: 'rating',
            label: 'Rating',
            children: [
                {
                    key: '0-1',
                    icon: <div>{renderStarRating(1)}</div>
                },
                {
                    key: '1-2',
                    icon: <div>{renderStarRating(2)}</div>
                },
                {
                    key: '2-3',
                    icon: <div>{renderStarRating(3)}</div>
                },
                {
                    key: '3-4',
                    icon: <div>{renderStarRating(4)}</div>
                },
                {
                    key: '4-5',
                    icon: <div>{renderStarRating(5)}</div>
                }
            ],
        },
    ];

    const itemsPrice: MenuItem[] = [
        {
            key: 'price',
            label: 'Price',
            icon: <FontAwesomeIcon icon={faMoneyBill} />,
            children: [
                {
                    key: 'priceup',
                    label: 'Ascending'
                },
                {
                    key: 'pricedown',
                    label: 'Descending'
                }
            ]
        },

    ];


    const itemsMultiple: MenuItem[] = [
        {
            key: 'category',
            label: 'Categories',
            icon: <FontAwesomeIcon icon={faList} />,
            children: categories,
        },
        {
            type: 'divider',
        },
        {
            key: 'author',
            label: 'Author',
            icon: <FontAwesomeIcon icon={faAt} />,
            children: authors,
        },
        {
            type: 'divider',
        },
    ];

    const books = useQuery(GET_BOOKS, variables);
    const totalBooks = useQuery(GET_TOTAL_BOOKS, totalVariables)
    const author_gql = useQuery(GET_AUTHORS);
    const category_gql = useQuery(GET_CATEGORIES);

    useEffect(() => {
        if (!author_gql.loading) {
            const authorsMap = author_gql.data.authors.map((author: AuthorEntity) => {
                return {
                    key: `author_${author.id}`,
                    label: `${author.firstName} ${author.lastName}`
                }
            });
            setAuthorFilter(author_gql.data.authors.map((author: AuthorEntity) => Number(author.id)));
            setInitAuthors(author_gql.data.authors.map((author: AuthorEntity) => Number(author.id)));
            setAuthors(authorsMap);
        }
    }, [author_gql]);

    useEffect(() => {
        if (!category_gql.loading) {
            const categoriesMap = category_gql.data.categories.map((category: CategoryEntity) => {
                return {
                    key: `category_${category.id}`,
                    label: category.name
                }
            });
            setCategoryFilter(category_gql.data.categories.map((category: CategoryEntity) => Number(category.id)));
            setInitCategories(category_gql.data.categories.map((category: CategoryEntity) => Number(category.id)));
            setCategories(categoriesMap);
        }
    }, [category_gql]);

    const displayBook = () => {
        if (books.loading) return <Loading />
        if (books.error) return <p>{books.error.message}</p>
        return books.data.books.map((book: BookEntity) => {
            return <CardBook userId={user.id} book={book} key={book.id} />
        })
    }

    return (
        <div className="grid grid-cols-7 gap-8">
            <div className="col-span-2">
                <Menu
                    multiple={true}
                    mode="inline"
                    onSelect={(item) => {
                        const category = item.selectedKeys.filter(item => item.split("_")[0] === 'category');
                        const author = item.selectedKeys.filter(item => item.split("_")[0] === 'author');
                        const authorId = author.map(author => {
                            return Number(author.split("_")[1]);
                        });
                        const categoryId = category.map(category => {
                            return Number(category.split("_")[1]);
                        });
                        if (authorId.length === 0) setAuthorFilter(initAuthors);
                        else setAuthorFilter(authorId);
                        if (categoryId.length === 0) setCategoryFilter(initCategories);
                        else setCategoryFilter(categoryId);
                    }}
                    onDeselect={(item) => {
                        const category = item.selectedKeys.filter(item => item.split("_")[0] === 'category');
                        const author = item.selectedKeys.filter(item => item.split("_")[0] === 'author');
                        const authorId = author.map(author => {
                            return Number(author.split("_")[1]);
                        });
                        const categoryId = category.map(category => {
                            return Number(category.split("_")[1]);
                        });

                        console.log("deselected: ", item);

                        if (authorId.length === 0) setAuthorFilter(initAuthors);
                        else setAuthorFilter(authorId);
                        if (categoryId.length === 0) setCategoryFilter(initCategories);
                        else setCategoryFilter(categoryId);
                    }}
                    items={itemsMultiple}
                />
                <Menu
                    mode="inline"
                    multiple={true}
                    onSelect={(item) => {
                        const flatMappedNumbers = item.selectedKeys.flatMap((range: string) => range.split('-').map(Number));
                        if (flatMappedNumbers) setReviewFilter([Math.min(...flatMappedNumbers), Math.max(...flatMappedNumbers)]);
                        else setReviewFilter([0, 5]);
                    }}
                    onDeselect={(item) => {
                        const flatMappedNumbers = item.selectedKeys.flatMap((range: string) => range.split('-').map(Number));
                        if (flatMappedNumbers.length !== 0) setReviewFilter([Math.min(...flatMappedNumbers), Math.max(...flatMappedNumbers)]);
                        else setReviewFilter([0, 5]);
                    }}
                    items={itemsRating}
                />
                <Menu
                    mode="inline"
                    onClick={(item) => {
                        setPriceFilter(item.key === 'pricedown' ? "desc" : "asc");
                    }}
                    items={itemsPrice}
                />
            </div>
            <div className="col-span-5 flex flex-col justify-between h-full items-center">
                {
                    books.error ? <p>Error: {books.error.message}</p> :
                        books.loading ? <Loading /> :
                            <div className="grid grid-cols-4 gap-8 px-16 my-8">
                                {displayBook()}
                            </div>
                }
                {
                    totalBooks.loading ? <Loading /> : <Paging
                        total={totalBooks.data.totalBooks}
                        page={page}
                        setPage={setPage}
                        limit={limit}
                        setLimit={setLimit}
                    />
                }

            </div>
            <div>
            </div>
        </div>
    )
}

export default Book;
