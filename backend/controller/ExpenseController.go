package controller

import (
	"backend/model"
	"backend/model/request"
	"backend/service"
	"encoding/json"
	"net/http"
	"strconv"
)

type ExpenseController interface {
	NewExpense(w http.ResponseWriter, r *http.Request)
	GetByPlan(w http.ResponseWriter, r *http.Request)
	GetByCategory(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}
type expenseController struct {
	service service.ExpenseService
}

func NewExpenseController(svc *service.ServiceBase) ExpenseController {
	return &expenseController{
		service: service.GetByType[service.ExpenseService](svc),
	}
}

func (ctrl *expenseController) NewExpense(w http.ResponseWriter, r *http.Request) {
	var e *request.ExpenseRequest
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	newExpense := model.Expense{
		Amount:      e.Amount,
		Description: e.Description,
		CategoryID:  e.CategoryID,
		Date:        e.Date,
		IsRecurring: e.IsRecurring,
		BudgetID:    e.BudgetID,
	}
	err := ctrl.service.NewExpense(&newExpense)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newExpense); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (ctrl *expenseController) GetByPlan(w http.ResponseWriter, r *http.Request) {
	planID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	v, err := ctrl.service.GetByPlan(planID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (ctrl *expenseController) GetByCategory(w http.ResponseWriter, r *http.Request) {
	categoryID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	v, err := ctrl.service.GetByCategory(categoryID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (ctrl *expenseController) Update(w http.ResponseWriter, r *http.Request) {
	var e model.Expense
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err := ctrl.service.Update(&e)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
func (ctrl *expenseController) Delete(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID   int `json:"id"`
		Plan int `json:"plan_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	err := ctrl.service.DeleteExpense(req.ID, req.Plan)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
