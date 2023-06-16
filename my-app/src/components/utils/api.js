import axios from "axios";
axios.defaults.withCredentials = true;
export const register = (u_name, u_username, u_email, u_password, u_position) => {
    const options = {
        method: 'GET',
        credentials: 'include',
        
        url: 'http://127.0.0.1:8000/register',
        params: {
            username: u_username,
            password: u_password,
            email: u_email,
            name: u_name,
            position: u_position
        },
    };

    return axios.request(options)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
            throw error; // re-throw the error to propagate it
        });
};
