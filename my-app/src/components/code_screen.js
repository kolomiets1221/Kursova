import React, {useEffect, useState} from "react";
import axios from "axios";

const CodeScreen = () => {
    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            getCode();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getCode = () => {
        axios
            .get("https://kolomietskursach.pythonanywhere.com/get_code")
            .then(function (response) {
                setCode(response.data.code);
                setTimeLeft(response.data.time_left);
            })
            .catch(function (error) {
                console.error("Error:", error.message);
            });
    };

    return (
        <div className="min-h-screen bg-gray-600 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8"
        style={{
                backgroundColor: "#1f2937",
            }}
        >
            <div
                 style={{
                     borderRadius: "0.5rem",
                     alignItems: "center",
                     justifyContent: "center",
                     display: "flex",
                        flexDirection: "column",

                 }}
            >
                <h2 className="mt-6 text-center font-extrabold text-green-500 text-9xl">
                    {code}
                </h2>
                <p className="mt-4 text-center text-white text-2xl">
                    Time Left: {timeLeft}s
                </p>
            </div>
        </div>
    );
};

export default CodeScreen;
