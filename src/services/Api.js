import axios, { HttpStatusCode } from "axios";

let SERVER = import.meta.env.VITE_APP_URL_SERVER;
let PORT   = import.meta.env.VITE_APP_PORT_SERVER || '';
let API_PREFIX   = import.meta.env.VITE_APP_API_PREFIX || '';

console.log('api.SERVER', SERVER)
console.log('api.PORT', PORT)
console.log('api.API_PREFIX', API_PREFIX)

// Create a instance of url to server backend
const url = PORT ? `${SERVER}:${PORT}` : `${SERVER}`
const url_server = API_PREFIX ? `${url}${API_PREFIX}` : url
console.log('api.url_server', url_server)
// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL : url_server
});

// implement a method to execute all the request from here.
const apiRequestMultipart = async (method, url, request) => {
  // const headers = { "Content-Type": "multipart/form-data"  };
  const headers = {};
  
  return axiosAPI({
      method,
      url,
      data: request,
      headers
    }).then(res => {
      return Promise.resolve(res.data);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

// implement a method to execute all the request from here.
const apiRequest = async (method, url, request) => {
    // const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    const isFormData = request instanceof FormData;
    const headers = isFormData
        ? { Accept: 'application/json' } // não força Content-Type
        : {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
    
    const config = {
      method,
      url,
      headers,
    };
    
    if (method.toLowerCase() === 'get') {
      config.params = request;
    } else {
      config.data = request;
    }

    return axiosAPI(config)
      .then(res => res.data)
      .catch(err => Promise.reject(err));
    
    // return axiosAPI({
    //     method,
    //     url,
    //     data: request,
    //     headers
    //   }).then(res => {
    //     return Promise.resolve(res.data);
    //   })
    //   .catch(err => {
    //     return Promise.reject(err);
    //   });
};


// implement a method to execute all the request from here.
const apiRequestLogin = async (method, url, request) => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return axiosAPI({
        method,
        url,
        data: request,
        headers
      }).then(res => {
        return Promise.resolve(res.data);
      })
      .catch(err => {
        return Promise.reject(err);
      });
};

// function to execute the http get request
const get = (url, request) => apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = (url, request) =>  apiRequest("delete", url, request);

// function to execute the http post request
const post = (url, request) => apiRequest("post", url, request);

// function to execute the http post request specific to login
const postLogin = (url, request) => apiRequestLogin("post", url, request);

// function to execute the http post request
const postMultipart = (url, request) => apiRequestMultipart("post", url, request);

// function to execute the http put request
const put = (url, request) => apiRequest("put", url, request);

// function to execute the http patch request
const patch = (url, request) =>  apiRequest("patch", url, request);

// function to execute the http post request
const downloadBlob = async (url, data) => {
  const base_url = url_server + url;
  try {
      const response = await axios.post(base_url, data, { responseType: 'blob' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      if (response.status == HttpStatusCode.Ok ){
          return pdfBlob;
      }
      else {
        return null;
      }
  } catch (error) {
      console.error('Error downloading PDF:', error);
      return null;
  }    
}

// Download file function
const downloadFile = async (url, data) => {
  var filename = data.file_name || 'download';
  try {
    const response = await axiosAPI.post(url, data, { responseType: 'blob' });
    const url_d = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url_d;

    // You may want to derive filename from content-disposition header
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch.length === 2) filename = fileNameMatch[1];
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url_d);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

// expose your method to other services or actions
const API = {
    get,
    delete: deleteRequest,
    post,
    postLogin,
    put,
    patch,
    postMultipart,
    downloadFile,
    downloadBlob,
    axiosAPI,
};

export default API;
