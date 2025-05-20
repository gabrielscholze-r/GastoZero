package controller

import (
	"backend/model"
	"backend/model/request"
	"backend/service"
	"encoding/json"
	"log"
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
	service     service.BudgetPlanService
	userService service.UserService
}

func NewBudgetPlanController(svc *service.ServiceBase) BudgetPlanController {
	return &budgetPlanController{
		service:     service.GetByType[service.BudgetPlanService](svc),
		userService: service.GetByType[service.UserService](svc),
	}
}

func (ctrl *budgetPlanController) CreatePlan(w http.ResponseWriter, r *http.Request) {
	var plan request.BudgetPlanRequest

	if err := json.NewDecoder(r.Body).Decode(&plan); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	expenses := make([]*model.Expense, len(plan.Expenses))
	for i, id := range plan.Expenses {
		expenses[i] = &model.Expense{ID: id}
	}

	budgetPlat := model.BudgetPlan{
		Name:        plan.Name,
		TotalAmount: 0,
		Description: plan.Description,
		UserID:      plan.UserID,
		Expenses:    expenses,
		CreatedDate: time.Now(),
	}
	email, ok := r.Context().Value("email").(string)
	if !ok {
		log.Println(ok)
		http.Error(w, "Email not found", http.StatusUnauthorized)
		return
	}
	err := ctrl.service.Create(&budgetPlat, email)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(budgetPlat); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (ctrl *budgetPlanController) GetByUser(w http.ResponseWriter, r *http.Request) {
	email, ok := r.Context().Value("email").(string)
	if !ok {
		log.Println(ok)
		http.Error(w, "Email not found", http.StatusUnauthorized)
		return
	}
	user, err := ctrl.userService.FindByEmail(email)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	plans, err := ctrl.service.FindByUser(user.ID)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if plans == nil {
		plans = []model.BudgetPlan{}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err = json.NewEncoder(w).Encode(plans); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (ctrl *budgetPlanController) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err = ctrl.service.Delete(id)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
func (ctrl *budgetPlanController) UpdateAmount(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID     int     `json:"id"`
		Amount float64 `json:"amount"`
		Add    bool    `json:"add"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err := ctrl.service.UpdateAmount(req.ID, req.Amount, req.Add)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
func (ctrl *budgetPlanController) Update(w http.ResponseWriter, r *http.Request) {
	var plan model.BudgetPlan
	if err := json.NewDecoder(r.Body).Decode(&plan); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err := ctrl.service.Update(&plan)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
