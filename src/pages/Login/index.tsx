import './style.scss'
import { useAuth } from '../../hooks/useAuth';
import { pages } from '../../utils/constant';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Alert } from 'antd';

const Login = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries());
        try {
            await login(formValues.email.toString(), formValues.password.toString());
        } catch (error: any) {
            setError(error.message);
        }
    }


    return <div className="m-auto w-2/6 h-full flex justify-center items-center">
        <div className="h-3/4 w-full bg-white rounded-3xl auth__wrapper">
            <div className="project__name text-center font-extrabold text-6xl pt-32 pb-8">Bookshop</div>
            <div className="font-extralight text-center text-lg">Please input your details.</div>

            <form
                className="my-28"
                onSubmit={handleSubmit}
            >
                <div className="px-28 w-full">
                    {
                        error ? <Alert message={error} type="error" className='mb-4' /> : null
                    }
                    <label className="block text-2xl font-medium leading-6 text-gray-900">Email</label>
                    <div className="mt-2">
                        <div className="w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                            <input className="block flex-1 border-0 bg-transparent pl-1 text-gray-900 text-xl py-1.5 placeholder:text-gray-400 focus:ring-0" id="email" type="email" name="email" placeholder="username" />
                        </div>
                    </div>
                    <label className="block text-2xl font-medium leading-6 text-gray-900 mt-4">Password</label>
                    <div className="mt-2">
                        <div className="w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                            <input className="block flex-1 border-0 bg-transparent pl-1 text-gray-900 text-xl py-1.5 placeholder:text-gray-400 focus:ring-0" id="password" type="password" name="password" placeholder="password" />
                        </div>
                    </div>
                    <div className="mt-8">
                        <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-2xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">Sign In</button>
                    </div>
                </div>
            </form>
            <div className='text-center'>
                <Link to={`/${pages.REGISTER}`} className='text-xl'>Doesn not have an account? Click here</Link>
            </div>
        </div>
    </div>
}

export default Login;
