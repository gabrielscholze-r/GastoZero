import API from '../../services/API.jsx';

const BASE_URL = "http://localhost:8080";

export const addExpense = async (expenseData) => {
    try {
        const response = await API.post(`${BASE_URL}/expense`, {
            amount: parseFloat(expenseData.amount),
            description: expenseData.description,
            category_id: parseInt(expenseData.category_id),
            category_name: expenseData.category_name,
            date: new Date(expenseData.date).toISOString(),
            is_recurring: expenseData.is_recurring === "yes",
            budget_id: parseInt(expenseData.budget_id),
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to add expense"
        );
    }
};


export const getExpensesByPlan = async (planId) => {
    try {
        const response = await API.get(`${BASE_URL}/expense/plan`, {
            params: {id: planId}
        });
        return response
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to get expenses");
    }
};

export const getCategories = async () => {
    try {
        const response = await API.get(`${BASE_URL}/category`)
        return response.data

    } catch (error) {
        throw new Error(error.message || "Failed to get categories");
    }
}

export const addNewCategory = async (name) => {
    try {
        const response = await API.post(`${BASE_URL}/category`, {name});
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const deleteExpense = async (id, plan) => {
    try {
        const response = await API.delete(`${BASE_URL}/expense`, {
            data: {
                "id": id,
                "plan_id": plan
            }});
        if (response.status === 200 || response.status === 204) {
            return true;
        } else {
            throw new Error("Error deleting");
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}
