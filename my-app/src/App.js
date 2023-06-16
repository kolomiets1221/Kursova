import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './components/Main';
import LoginPage from "./components/login_page";
import RegisterPage from "./components/register_page";
import './App.css';
import * as api from "./components/utils/api";

function App() {
    let username = "";
    let password = "";
    let email = "";
    let name = "";
    let position = "";
    const [is_loading, set_is_loading] = useState(false);
    const [message, set_message] = useState("");

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
        set_is_loading(true);
        const resp = api.register(name, username, email, password, position);
        console.log(resp);
        set_is_loading(false);
        set_message("User created")
    };


    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;