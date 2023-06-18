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
        .get('https://kolomietskursach.pythonanywhere.com/register', options)
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
        .get('https://kolomietskursach.pythonanywhere.com/login', options)
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
        .get('https://kolomietskursach.pythonanywhere.com/user_info')
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

export const get_code = () => {
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/get_code')
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

export const start_shift = (code_u, id_u) => {
    const options = {
        params: {
            code: code_u,
            id: id_u,
        },
    };
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/start_shift', options)
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

export const end_shift = (id, prod) => {
    const options = {
        params: {
            producted: prod,
            id: id,
        },
    };
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/end_shift', options)
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


export const upload_image = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return axios
        .post('https://kolomietskursach.pythonanywhere.com/upload_avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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

export const get_employers = () => {
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/get_employers')
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
        }
    );
}

export const get_employee = (id) => {
    const options = {
        params: {
            id: id,
        },
    };
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/get_employee', options)
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

export const get_user_info = () => {
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/get_user_info')
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
}

export const logout = () => {
    return axios
        .get('https://kolomietskursach.pythonanywhere.com/logout')
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
}


