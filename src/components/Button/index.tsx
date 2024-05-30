import React from 'react';
import { Link } from 'react-router-dom';

interface CustomButtonProps {
    to: string;
    text?: string;
    children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ to, text, children }) => {
    return (<Link to={to} className="text-center">
        <div className="bg-violet-500 shadow-lg shadow-violet-500/50 text-white text-xl border transition mx-auto w-2/4 p-2 rounded-lg hover:text-violet-500 hover:bg-white hover:border-violet-500">
            {text && <span>{text}</span>}
            {children}
        </div>
    </Link>

    );
};

export default CustomButton;
