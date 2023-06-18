import React, {useEffect, useState} from "react";
import {MdMarkEmailUnread} from "react-icons/md";
import * as api from "./utils/api";
import {Link, useNavigate} from "react-router-dom";


const Workers = () => {

    document.title = "Працівники";
    const navigate = useNavigate();

    const [employ, set_employers] = useState([]);

    useEffect(
        () => {
            const resp = api.get_employers();
            resp.then((response) => {
                if (response.status === 200) {
                    set_employers(response.data);
                } else {
                    console.error("Error:", response);
                }
            });
        },[]
    )

    return (
        <div
        className="min-h-screen bg-gray-100 py-8"
        style={{
            minWidth: "100%",
        }}
        >
            {employ.employers ? (
                <div className="min-h-screen bg-gray-100 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mt-10">
                            <h2 className="text-3xl font-bold text-gray-900">Працівники</h2>
                            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                                {employ.employers.map((employer, index) => (
                                    <div
                                        key={index}
                                        className="bg-white overflow-hidden shadow rounded-lg"
                                    >
                                        <img
                                            src={employer.avatar}
                                            alt={employer.name}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="px-4 py-4">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {employer.name}
                                            </h3>
                                            <p className="text-gray-600">{employer.position}</p>
                                            <a
                                                href={"mailto:" + employer.email}
                                                className="flex items-center mt-4 text-gray-600 space-x-1 cursor-pointer"
                                            >
                                                <MdMarkEmailUnread className="inline-block"/>
                                                <p className="text-gray-600">{employer.email}</p>
                                            </a>
                                        </div>
                                        <Link to={"/workers/" + employer.id}>
                                            <button
                                                className="w-full bg-indigo-600 text-white py-3 px-4 hover:bg-indigo-700"
                                            >
                                                Переглянути
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gray-100 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mt-10">
                            <h2 className="text-3xl font-bold text-gray-900">Працівники</h2>
                            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-4">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Немає працівників
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
};

export default Workers;
