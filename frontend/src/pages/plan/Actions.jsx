import api from '../../services/API.jsx';
import API from '../../services/API.jsx';

const BASE_URL = "http://localhost:8080";

export const addExpense = async (expenseData) => {
  try {
    const response = await API.post(`${BASE_URL}/expense`, {
      amount: parseFloat(expenseData.amount),
      description: expenseData.description,
      category_id: parseInt(expenseData.category_id),
      date: new Date(expenseData.date).toISOString(),
      is_recurring: expenseData.is_recurring === "yes",
      budget_id: parseInt(expenseData.budget_id)
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: {
          id: response.data.ID,
          amount: response.data.Amount,
          description: response.data.Description,
          category_id: response.data.CategoryID,
          date: new Date(response.data.Date).toLocaleDateString(),
          is_recurring: response.data.IsRecurring,
          budget_id: response.data.BudgetID
        }
      };
    }
    throw new Error(response.data?.message || "Failed to add expense");
  } catch (error) {
    console.error("Add expense error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Network error"
    };
  }
};

export const getExpensesByPlan = async (planId) => {
  try {
    const response = await API.get(`${BASE_URL}/expense/plan`, {
      params: { id: planId }
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data?.map(expense => ({
          id: expense.ID,
          amount: expense.Amount,
          description: expense.Description,
          category_id: expense.CategoryID,
          date: new Date(expense.Date).toLocaleDateString(),
          is_recurring: expense.IsRecurring,
          budget_id: expense.BudgetID
        }))
      };
    }
    throw new Error(response.data?.message || "Failed to get expenses");
  } catch (error) {
    console.error("Get expenses error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Network error"
    };
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
        return await API.post(`${BASE_URL}/category`,{name}).data
    } catch (error) {
        throw new Error(error.message)
    }
}