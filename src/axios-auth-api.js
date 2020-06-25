import axios from 'axios';

const serverAuth = axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
})

export default serverAuth;