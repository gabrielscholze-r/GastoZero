import axios from "axios"
import Cookies from 'js-cookie'

const defaultPath = "http://localhost:8080/" 

const login = (email, password) => {
    axios.post(defaultPath + "users/login", {
        email,
        password
    })
    .then(dispatch => {
        dispatch.data["token"] ? Cookies.set("authToken", dispatch.data["token"]) : null
    })
}


export default login