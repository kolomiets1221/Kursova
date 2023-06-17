import axios from "axios";

axios.defaults.withCredentials = true;

export const register = (u_name, u_username, u_email, u_password, u_position) => {
    const options = {
        params: {
            username: u_username,
            password: u_password,
            email: u_email,
            name: u_name,
            position: u_position,
        },
    };

    return axios
        .get('http://127.0.0.1:8000/register', options)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            if (error.response) {
                console.error('Request failed with status code:', error.response.status);
                return error.response;
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        });
};

export const login = (u_username, u_password, remember = false) => {
    const options = {
        params: {
            username: u_username,
            password: u_password,
            remember_me: remember,
        },
    };

    return axios
        .get('http://127.0.0.1:8000/login', options)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            if (error.response) {
                console.error('Request failed with status code:', error.response.status);
                return error.response;
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        });
};

export const get_profile = () => {
    return axios
        .get('http://127.0.0.1:8000/user_info')
        .then(function (response) {
                return response;
            }
        )
        .catch(function (error) {
            if (error.response) {
                console.error('Request failed with status code:', error.response.status);
                return error.response;
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            throw error;
        });
}
