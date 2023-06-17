import React from 'react';

const Header = () => {
    return (
        <header className="bg-indigo-950 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-white text-2xl font-bold">Zavod services</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#" className="text-white hover:text-pink-200">Home</a></li>
                        <li><a href="#" className="text-white hover:text-pink-200">Services</a></li>
                        <li><a href="#" className="text-white hover:text-pink-200">Pricing</a></li>
                        <li><a href="#" className="text-white hover:text-pink-200">About</a></li>
                        <li><a href="#" className="text-white hover:text-pink-200">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
