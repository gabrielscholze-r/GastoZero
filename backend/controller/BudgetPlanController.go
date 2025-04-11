package controller

import (
	"backend/model"
	"backend/model/request"
	"backend/service"
	"encoding/json"
	"net/http"
	"strconv"
	"time"
)

type BudgetPlanController interface {
	CreatePlan(w http.ResponseWriter, r *http.Request)
	GetByUser(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
	UpdateAmount(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
}

type budgetPlanController struct {
	service service.BudgetPlanService
}

func NewBudgetPlanController(svc *service.ServiceBase) BudgetPlanController {
	return &budgetPlanController{service: service.GetByType[service.BudgetPlanService](svc)}
}

func (ctrl *budgetPlanController) CreatePlan(w http.ResponseWriter, r *http.Request) {
	var plan request.BudgetPlanRequest

	if err := json.NewDecoder(r.Body).Decode(&plan); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	budgetPlat := model.BudgetPlan{
		Name:        plan.Name,
		TotalAmount: 0,
		Description: plan.Description,
		UserID:      plan.UserID,
		Expenses:    plan.Expenses,
		CreatedDate: time.Now(),
	}
	err := ctrl.service.Create(&budgetPlat)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(budgetPlat); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (ctrl *budgetPlanController) GetByUser(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	user, err := ctrl.service.FindByUser(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (ctrl *budgetPlanController) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err = ctrl.service.Delete(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
func (ctrl *budgetPlanController) UpdateAmount(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID     int     `json:"id"`
		Amount float64 `json:"amount"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err := ctrl.service.UpdateAmount(req.ID, req.Amount)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
func (ctrl *budgetPlanController) Update(w http.ResponseWriter, r *http.Request) {
	var plan model.BudgetPlan
	if err := json.NewDecoder(r.Body).Decode(&plan); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err := ctrl.service.Update(&plan)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
