import API from "../../services/API";

const defaultPath = "http://localhost:8080/";

const login = async (email, password) => {
    try {
        const response = await API.post(defaultPath + "users/login", {
            email,
            password,
        });

        const token = response.data?.token;

        if (token) {
            return token;
        } else {
            throw new Error("Token not found");
        }
    } catch (error) {
        throw new Error(error.response?.data);
    }
};

export default login;
