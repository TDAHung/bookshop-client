import { Pagination } from "antd";
import { Dispatch, SetStateAction } from "react";

interface Props {
    total: number,
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    limit: number,
    setLimit: Dispatch<SetStateAction<number>>
}

const Paging = (
    { total, page, setPage, limit, setLimit }: Props) => {
    console.log(total);
    console.log(limit);
    return <Pagination
        defaultCurrent={page}
        total={total}
        pageSize={limit}
        onShowSizeChange={(size) => {
            setLimit(size)
        }}
        onChange={(page) => {
            setPage(page)
        }}
    />;
}

export default Paging;
