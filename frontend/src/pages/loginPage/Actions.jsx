import axios from "axios";

const defaultPath = "http://localhost:8080/";

const login = async (email, password) => {
    try {
        const response = await axios.post(defaultPath + "users/login", {
            email,
            password,
        });

        const token = response.data?.token;

        if (token) {
            return token;
        } else {
            throw new Error("Token não encontrado na resposta.");
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erro ao fazer login.");
    }
};

export default login;
