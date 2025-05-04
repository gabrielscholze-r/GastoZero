import axios from "axios";

const defaultPath = "http://localhost:8080/";

const create = async (name, email, password) => {
    const response = await axios.post(defaultPath + "users", {
        name,
        email,
        password,
    });
    return response.data;
};

export default create;
