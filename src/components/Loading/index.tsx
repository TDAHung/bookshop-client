import { Spin } from 'antd';
import './style.scss';

export const Loading = () => {
    return (
        <div className="fp-loading">
            <Spin size="large" />
        </div>
    );
};
