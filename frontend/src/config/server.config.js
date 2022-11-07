
import axios from 'axios'
import socketIOClient from "socket.io-client";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
if(sessionStorage.getItem("data") && JSON.parse(sessionStorage.getItem("data")).token){
    const token = JSON.parse(sessionStorage.getItem("data")).token;
    axios.defaults.headers.common['token'] = token;
}
const socket = socketIOClient(process.env.REACT_APP_API_URL);

export default axios;
export {socket};