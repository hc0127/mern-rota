
import axios from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV == 'development'?process.env.DEVELOPMENT_URL:process.env.PRODUCTION_URL;

export default axios;