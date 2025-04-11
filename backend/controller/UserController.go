package controller

import (
	"backend/model"
	"backend/model/request"
	"backend/model/response"
	"backend/service"
	"encoding/json"
	"net/http"
	"strconv"
)

type UserController interface {
	CreateUser(w http.ResponseWriter, r *http.Request)
	FindByEmail(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
	UpdatePassword(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}
type userController struct {
	service service.UserService
}

func NewUserController(svc *service.ServiceBase) UserController {
	return &userController{
		service: service.GetByType[service.UserService](svc),
	}
}

func (ctrl *userController) CreateUser(w http.ResponseWriter, r *http.Request) {
	var u request.UserRequest

	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}
	user := model.User{
		Name:     u.Name,
		Email:    u.Email,
		Password: u.Password,
	}
	err := ctrl.service.CreateUser(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	resp := response.UserResponse{
		ID:          user.ID,
		Name:        user.Name,
		Email:       user.Email,
		CreatedDate: user.CreatedDate,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "response failure: "+err.Error(), http.StatusInternalServerError)
	}
}

func (ctrl *userController) FindByEmail(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	user, err := ctrl.service.FindByEmail(email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	resp := response.UserResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode JSON: "+err.Error(), http.StatusInternalServerError)
	}
}

func (ctrl *userController) Login(w http.ResponseWriter, r *http.Request) {
	var u request.LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	token, err := ctrl.service.Login(&u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(map[string]string{"token": token})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}
func (ctrl *userController) UpdatePassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	email := r.Context().Value("email").(string)

	current, err := ctrl.service.FindByEmail(email)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	err = ctrl.service.UpdatePassword(current, req.NewPassword)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte("Password updated successfully"))
	if err != nil {
		return
	}
}

func (ctrl *userController) Update(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID    int    `json:"ID"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
	}
	user := model.User{
		ID:    req.ID,
		Name:  req.Name,
		Email: req.Email,
	}
	err := ctrl.service.Update(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)

}

func (ctrl *userController) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	err = ctrl.service.Delete(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.WriteHeader(http.StatusOK)
}
