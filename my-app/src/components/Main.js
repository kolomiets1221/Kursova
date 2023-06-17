import React, { useEffect, useState } from 'react';
import * as api from "./utils/api";

const Main = () => {
    document.title = "Profile";

    const [data, setData] = useState({});

    useEffect(() => {
        api.get_profile().then((response) => {
            setData(response.data);
        });
    }, []);

    const monye_format = (money) => {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <div>
            {data.shifts ? (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img
                                src={data.img_url}
                                alt={data.name}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <h2 className="text-xl font-bold">{data.name}</h2>
                                <p className="text-gray-500">{data.position}</p>
                                <p className="text-gray-500">Expected Salary {monye_format(parseInt(data.expected_salary))} UAH</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Total Shifts: {data.total_shifts}</span>
                            <span>Average Work Time: {data.average_worktime}</span>
                        </div>
                    </div>
                    <div className="grid  grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 justify-center ">
                        {data.shifts ? (
                            data.shifts.map((shift) => (
                                <div
                                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                                    key={shift.id}
                                >
                                    <a href="#">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            Shift #{shift.id}
                                        </h5>
                                    </a>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Start Time: {shift.start_time}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        End Time: {shift.end_time}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        producted: {shift.producted}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Started: {shift.employ_start_time}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Ended: {shift.employ_end_time}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Shift work time: {shift.shift_work_time} hours
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        finished: {shift.finished ? "Yes" : "No"}
                                    </p>
                                    <a href="#"
                                       className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Start Shift
                                        <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor"
                                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.94l3-2.65z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p>Worked Last Month: {data.worked_last_month}</p>
                            <p>Shifts in Next Month: {data.shifts_in_next_month}</p>
                            <p>Expected Salary: {data.expected_salary}</p>
                        </div>
                        <div>
                            <p>Total Produced: {data.total_produced}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.94l3-2.65z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default Main;
