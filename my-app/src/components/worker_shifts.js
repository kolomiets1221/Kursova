import React, { useEffect, useState } from 'react';
import * as api from "./utils/api";
import {useParams} from "react-router-dom";
import {get_employee} from "./utils/api";


const WorkersShifts = () => {

    const id = useParams().id;
    const [data, setData] = useState({});

    document.title = "Профіль";


    useEffect(() => {
        const resp = api.get_employee(id);
        resp.then((response) => {
            if (response.status === 200) {
                setData(response.data);
            } else {
                console.error("Error:", response);
            }
        }
        );
    }, []);

    const moneyFormat = (money) => {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {data.shifts ? (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div>
                                <img
                                    src={data.avatar}
                                    alt={data.name}
                                    className="w-10 h-10 rounded-full mr-4"
                                    style={{
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{data.name}</h2>
                                <p className="text-gray-500">{data.position}</p>
                                <p className="text-gray-500">Очікувана Зарплата: {moneyFormat(parseInt(data.expected_salary))} UAH</p>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gridGap: "1rem",
                        }}
                    >
                        {data.shifts.map((shift) => (
                            <div
                                className={`max-w-sm p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${
                                    shift.is_active
                                        ? 'bg-blue-100'
                                        : shift.finished
                                            ? 'bg-green-100 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                                            : 'bg-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                }`}
                                key={shift.id}
                            >
                                <a>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Зміна #{shift.id}
                                    </h5>
                                </a>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    Час Початку: {shift.start_time}
                                </p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    Час Закінчення: {shift.end_time}
                                </p>
                                {shift.finished && (
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Вироблено: {shift.producted} шт.
                                    </p>
                                )}
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    Почато: {shift.employ_start_time}
                                </p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    Закінчено: {shift.employ_end_time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center py-16">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span className="text-gray-600">Loading...</span>
                </div>
            )}
        </div>
    );
}

export default WorkersShifts;
