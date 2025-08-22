import axios from "axios";
import { authHeader } from './auth-header';

export const userService = {
    login,
    logout,
    register,
    getAll,
};

async function login(email, password) {
    console.log("login aqui", email, password);
    try {
        const form = new FormData();
        form.set("username", email);
        form.set("password", password);
        const PORT   = process.env.VUE_APP_PORT_SERVER;
        const SERVER = process.env.VUE_APP_URL_SERVER;
        const URL = PORT ? `${SERVER}:${PORT}/api/usu/signin` : `${SERVER}/api/usu/signin`
        const response = await axios.post(URL, form);
        
        const token = response.data.access_token;
        if (token) {
            localStorage.setItem("access_token", JSON.stringify(token));
        }
        return response.data;
    } catch (error) {
        console.error("Ocorreu um erro durante o login:", error);
        throw error;
    }
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch(`/users/register`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
