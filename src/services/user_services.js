import Api from "./Api";
import qs from 'qs';

export const user_login = async (email, password) => {
    
    const form = qs.stringify({
        grant_type: 'password',
        username: email,
        password: password,
        scope: '',
        client_id: '1',
        client_secret: ''
    });
    
    try {
        const response = await Api.postLogin(`/usu/signin`, form);
        
        // const token = response.data.access_token;
        // if (token) {
        //     localStorage.setItem("access_token", JSON.stringify(token));
        // }
        return response;
    } catch (error) {
        console.log("user_login.error:", error);
        return
    }
}

export const user_logout = async () => {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

// function register(user) {
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(user)
//     };
//     return fetch(`/users/register`, requestOptions).then(handleResponse);
// }

// function getAll() {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };
//     return fetch(`/users`, requestOptions).then(handleResponse);
// }

// function handleResponse(response) {
//     return response.text().then(text => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             if (response.status === 401) {
//                 // auto logout if 401 response returned from api
//                 logout();
//                 location.reload(true);
//             }
//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }
//         return data;
//     });
// }
