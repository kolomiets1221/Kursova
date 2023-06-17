import React, {Fragment, useEffect, useRef, useState} from 'react';
import * as api from "./utils/api";
import {Dialog, Transition} from '@headlessui/react';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {CheckIcon} from "@heroicons/react/20/solid";
import Loading from "./loading";

const Main = () => {

    const [is_loading, set_is_loading] = useState(false);

    const [produced, setProduced] = useState(0);
    const [shiftCode, setShiftCode] = useState("");
    const [id, setId] = useState(0);


    document.title = "Профіль";

    const [data, setData] = useState({});

    const [open_s, setOpen_s] = useState(false);
    const [open_f, setOpen_f] = useState(false);
    const cancelButtonRef = useRef(null)

    useEffect(() => {
        api.get_profile().then((response) => {
            setData(response.data);
        });
    }, []);

    const moneyFormat = (money) => {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const handleStartShift = () => {
        console.log("Start shift");
        setOpen_s(true);
    }

    const handleFinishShift = () => {
        console.log("Finish shift");
        setOpen_f(true);
    }

    return (
        <div className="container mx-auto px-4 py-8">
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
                                <p className="text-gray-500">Очікувана
                                    Зарплата: {moneyFormat(parseInt(data.expected_salary))} UAH</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Всього Змін: {data.total_shifts}</span>
                            <span>Середній Робочий Час: {data.average_worktime}</span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gridGap: "1rem",

                        }}
                    >
                        {data.shifts ? (
                            data.shifts.map((shift) => (
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
                                    <a href="#">
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
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Вироблено: {shift.producted}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Почато: {shift.employ_start_time}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Закінчено: {shift.employ_end_time}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Робочий час зміни: {shift.shift_work_time} годин
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Завершено: {shift.finished ? "Так" : "Ні"}
                                    </p>
                                    <button
                                        disabled={shift.finished}
                                        href="#"
                                        onClick={() => {
                                            console.log(shift.id);
                                            setId(shift.id);
                                            if (shift.is_active) {
                                                handleFinishShift();
                                            } else {
                                                handleStartShift();
                                            }
                                        }}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 ${
                                            shift.finished
                                                ? 'bg-gray-400'
                                                : shift.is_active
                                                    ? 'bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 hover:bg-blue-800'
                                                    : 'bg-green-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:bg-blue-800'
                                        }`}
                                    >
                                        {shift.finished ? "Зміна закінчилась" : shift.is_active ? "Завершити зміну" : "Почати зміну"}
                                        <svg
                                            aria-hidden="true"
                                            className="w-4 h-4 ml-2 -mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>


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
                            <p>Працював Минулого Місяця: {data.worked_last_month}</p>
                            <p>Зміни у Наступному Місяці: {data.shifts_in_next_month}</p>
                            <p>Очікувана Зарплата: {data.expected_salary}</p>
                        </div>
                        <div>
                            <p>Всього Вироблено: {data.total_produced}</p>
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
            <Transition.Root show={open_f} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={() => {
                        if (!is_loading) {
                            setOpen_f(false);
                        }
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div
                                                className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600"
                                                                         aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3"
                                                              className="text-base font-semibold leading-6 text-gray-900">
                                                    Ви дійсно бажаєте завершити зміну?
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Ця дія необоротна. Ви не зможете знову почати зміну.
                                                    </p>
                                                </div>
                                                <div className="mt-4 flex row-auto">
                                                    <p className="text-sm text-gray-500">Кількість виготовленого
                                                        продукту:</p>
                                                    <input
                                                        type="number"
                                                        onChange={(e) => {
                                                            const value = Math.max(1, Math.min(500, parseInt(e.target.value)));
                                                            setProduced(value);
                                                        }}
                                                        className="ml-2 w-14 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 text-center"
                                                        value={produced}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className={`inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto ${
                                                is_loading ? 'opacity-50' : ''
                                            }`}
                                            onClick={() => {
                                                set_is_loading(true)
                                                const resp = api.end_shift(id, produced);
                                                resp.then((data) => {
                                                    setOpen_f(false);
                                                    set_is_loading(false)
                                                    window.location.reload();
                                                });
                                            }}
                                            disabled={is_loading}
                                        >
                                            Завершити
                                        </button>
                                        <button
                                            type="button"
                                            className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto ${
                                                is_loading ? 'opacity-50' : ''
                                            }`}
                                            onClick={() => {
                                                if (is_loading) return;
                                                setOpen_f(false);
                                            }}
                                            ref={cancelButtonRef}
                                            disabled={is_loading}
                                        >
                                            Відміна
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>


            {/*start shift window lower*/}

            <Transition.Root show={open_s} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={() => {
                        if (is_loading) return;
                        setOpen_s(false);
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div
                                                className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3"
                                                              className="text-base font-semibold leading-6 text-gray-900">
                                                    Ви дійсно бажаєте розпочати зміну?
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Ця дія почне нову зміну. Введіть 10-символьний код для початку.
                                                    </p>
                                                    <div className="mt-4 flex row-auto">
                                                        Код
                                                        <div className="ml-2 pl-3">
                                                            <input
                                                                type="text"
                                                                maxLength={10}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.slice(0, 10);
                                                                    setShiftCode(value);
                                                                }}
                                                                // set padding
                                                                className="w-40 border h-15 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 text-center"
                                                                value={shiftCode}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className={`inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto ${
                                                is_loading ? 'opacity-50' : ''
                                            }`}
                                            onClick={() => {
                                                set_is_loading(true);
                                                const resp = api.start_shift(shiftCode, id);
                                                resp.then((data) => {
                                                    setOpen_s(false);
                                                    set_is_loading(false);
                                                    window.location.reload();
                                                });
                                            }}
                                            disabled={is_loading}
                                        >
                                            {is_loading ? <Loading/> : null}
                                            Розпочати зміну
                                        </button>
                                        <button
                                            type="button"
                                            className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto ${
                                                is_loading ? 'opacity-50' : ''
                                            }`}
                                            onClick={() => {
                                                if (is_loading) return;
                                                setOpen_s(false);
                                            }}
                                            ref={cancelButtonRef}
                                            disabled={is_loading}
                                        >
                                            Відміна
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>


        </div>
    );
};

export default Main;
