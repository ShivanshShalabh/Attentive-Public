import axios from "axios";

axios.defaults.baseURL = 'https://attentive.onrender.com/';

const setAuthToken = (token=false) => {
    if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }
}
export default setAuthToken;