import { gql, useQuery } from "@apollo/client";
import { faAt, faFilter, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuProps } from "antd";

const GET_BOOKS = gql`
query showAll($page: Float!, $limit: Float!, $sortBy: [SortBy!]!){
    books(page: $page, limit: $limit, sortBy: $sortBy){
        id,
        price,
        title,
        description,
        avgRating,
      	images{
          key,
          name,
          size,
          url
        },
        authors{
          author{
            id,
            firstName,
            lastName
          }
        },
    }
}
`;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'sub1',
        label: 'Category',
        icon: <FontAwesomeIcon icon={faList} />,
        children: [
            {
                key: 'g1',
                label: 'Item 1',
                type: 'group',
                children: [
                    { key: '1', label: 'Option 1' },
                    { key: '2', label: 'Option 2' },
                ],
            },
            {
                key: 'g2',
                label: 'Item 2',
                type: 'group',
                children: [
                    { key: '3', label: 'Option 3' },
                    { key: '4', label: 'Option 4' },
                ],
            },
        ],
    },
    {
        key: 'sub2',
        label: 'Author',
        icon: <FontAwesomeIcon icon={faAt} />,
        children: [
            { key: '5', label: 'Option 5' },
            { key: '6', label: 'Option 6' },
            {
                key: 'sub3',
                label: 'Submenu',
                children: [
                    { key: '7', label: 'Option 7' },
                    { key: '8', label: 'Option 8' },
                ],
            },
        ],
    },
    {
        type: 'divider',
    },
    {
        key: 'sub4',
        label: 'Filter',
        icon: <FontAwesomeIcon icon={faFilter} />,
        children: [
            { key: '9', label: 'Option 9' },
            { key: '10', label: 'Option 10' },
            { key: '11', label: 'Option 11' },
            { key: '12', label: 'Option 12' },
        ],
    },
    {
        key: 'grp',
        label: 'Group',
        type: 'group',
        children: [
            { key: '13', label: 'Option 13' },
            { key: '14', label: 'Option 14' },
        ],
    },
];

const Book = () => {

    const { loading, error, data } = useQuery(GET_BOOKS, {
        variables: {
            // page: 2,
            limit: 10,
            sortBy: [],
        }
    });




    return (
        <div className="grid grid-cols-7 gap-8 ">
            <div className="col-span-2 bg-blue-400">
                <Menu
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    items={items}
                />
            </div>
            <div className="col-span-5 bg-red-400">

            </div>
        </div>
    )
}

export default Book;
