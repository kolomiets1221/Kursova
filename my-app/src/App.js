import React, {useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Main from './components/Main';
import LoginPage from "./components/login_page";
import RegisterPage from "./components/register_page";
import './App.css';
import * as api from "./components/utils/api";
import CodeScreen from "./components/code_screen";
import Header from "./components/header";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Workers from "./components/workers";
import WorkerShifts from "./components/worker_shifts";

let username = "";
let password = "";
let email = "";
let name = "";
let position = "";
let remember = false;



function App() {
    const createNotification = (type, message) => {
        switch (type) {
            case 'info':
                NotificationManager.info(message);
                break;
            case 'success':
                NotificationManager.success(message);
                break;
            case 'warning':
                NotificationManager.warning(message);
                break;
            case 'error':
                NotificationManager.error(message);
                break;
            default:
                break;
        }
    }
    const [is_loading, set_is_loading] = useState(false);
    const [message, set_message] = useState("");
    const navigate = useNavigate()

    const changeUsername = (value) => {
        username = value;
    }
    const changePassword = (value) => {
        password = value;
    }
    const changeEmail = (value) => {
        email = value;
    }
    const changeName = (value) => {
        name = value;
    }
    const changePosition = (value) => {
        position = value;
    }


    const register = () => {
        set_message("");
        if (
            username === "" ||
            password === "" ||
            email === "" ||
            name === "" ||
            position === ""
        ) {
            set_message("Please fill all fields");
            return;
        }
        set_is_loading(true);
        const resp = api.register(name, username, email, password, position);
        resp.then(function (response) {
            if (response.status === 201) {
                navigate("/");
                set_is_loading(false);
                set_message("")
            } else {
                set_message(response.data.message);
                set_is_loading(false);
            }
        });
    };



    const handle_remember = (value) => {
        remember = value;
    }

    const login = () => {
        set_message("");
        if (username === "" || password === "") {
            set_message("Please fill all fields");
            return;
        }
        set_is_loading(true);
        api.login(username, password, remember)
            .then(function (response) {
                    if (response.status === 200) {
                        navigate("/");
                        set_is_loading(false);
                        set_message("")
                    } else {
                        set_message(response.data.message);
                        set_is_loading(false);
                    }
                }
            );
    }


    return (
       <div>
           <NotificationContainer />
           <Header/>
           <Routes>
               <Route path="/" element={<Main
               createNotification={createNotification}
               />}/>
               <Route path="/login" element={<LoginPage
                   changeUsername={changeUsername}
                   changePassword={changePassword}
                   login={login}
                   is_loading={is_loading}
                   message={message}
                   remember={handle_remember}
               />}/>
               <Route path="/register" element={<RegisterPage
                   changeEmail={changeEmail}
                   changeName={changeName}
                   changePassword={changePassword}
                   changePosition={changePosition}
                   changeUsername={changeUsername}
                   register_user={register}
                   is_loading={is_loading}
                   message={message}
               />}/>
               <Route path="/code" element={<CodeScreen/>}/>
                <Route path="/workers" element={<Workers/>}/>
                <Route path="/workers/:id" element={<WorkerShifts/>}/>
               <Route path="*" element={<h1>404</h1>}/>
           </Routes>
       </div>
    );
}

export default App;