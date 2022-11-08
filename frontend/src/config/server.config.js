
import axios from 'axios'
import socketIOClient from "socket.io-client";

console.log("server setting");

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
if(sessionStorage.getItem("data")){
    const token = JSON.parse(sessionStorage.getItem("data")).token;
    axios.defaults.headers.common['token'] = token;
}
const socket = socketIOClient(process.env.REACT_APP_API_URL);

console.log("server setting end");

export default axios;
export {socket};