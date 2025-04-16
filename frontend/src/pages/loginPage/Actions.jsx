import axios from "axios"

const defaultPath = "http://localhost:8080/" 
const login = (email, password) => {
    axios.post(defaultPath + "users/login", {
        email,
        password
    })
    .then(dispatch => {
        console.log(dispatch)
    })
}


export default login