import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-indigo-950 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-white text-2xl font-bold">АСОП</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <Link to={"/"} className="text-white hover:text-gray-200 font-semibold">Профіль</Link>
                        <Link to={"/register"} className="text-white hover:text-gray-200 font-semibold">Реєстрація</Link>
                        <Link to={"/login"} className="text-white hover:text-gray-200 font-semibold">Увійти</Link>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
