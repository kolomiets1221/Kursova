import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from './utils/api';

const Header = ({ is_logged_in, set_is_logged_in }) => {
    const navigate = useNavigate();
    return (
        <header className="bg-indigo-950 py-4 sm:px-4 px-2">
            <div className="container mx-auto px-2 flex items-center justify-between">
                <Link to="/" className="text-white text-2xl font-bold">
                    АСОП
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        {is_logged_in ? (
                            <>
                                <Link
                                    to="/"
                                    className="text-white hover:text-gray-200 font-semibold"
                                >
                                    Профіль
                                </Link>
                                <Link
                                    to="/workers"
                                    className="text-white hover:text-gray-200 font-semibold"
                                >
                                    Працівники
                                </Link>
                                <Link
                                    to="/code"
                                    className="text-white hover:text-gray-200 font-semibold"
                                >
                                    Табло
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => {
                                        api.logout();
                                        set_is_logged_in(false);
                                        navigate('/login');
                                    }}
                                    className="text-white hover:text-gray-200 font-semibold"
                                >
                                    Вийти
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="text-white hover:text-gray-200 font-semibold"
                                >
                                    Реєстрація
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-white hover:text-gray-200 font-semibold"
                                >
                                    Увійти
                                </Link>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
