
import axios from 'axios'

console.log(process.env);
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export default axios;