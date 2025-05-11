package controller

import (
	"backend/model"
	"backend/model/request"
	"backend/service"
	"encoding/json"
	"net/http"
	"strconv"
)

type CategoryController interface {
	CreateCategory(w http.ResponseWriter, r *http.Request)
	FindByName(w http.ResponseWriter, r *http.Request)
	FindById(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	GetAll(w http.ResponseWriter, r *http.Request)
}

type categoryController struct {
	service service.CategoryService
}

func NewCategoryController(factory *service.ServiceBase) CategoryController {
	return &categoryController{
		service: service.GetByType[service.CategoryService](factory),
	}
}

func (ctrl *categoryController) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var c *request.CategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
	}

	category := model.Category{
		Name: c.Name,
	}

	err := ctrl.service.NewCategory(&category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(&category); err != nil {
		http.Error(w, "response failure: "+err.Error(), http.StatusInternalServerError)
	}
}

func (ctrl *categoryController) GetAll(w http.ResponseWriter, r *http.Request) {
	c, err := ctrl.service.FindAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(c); err != nil {
		http.Error(w, "response failure: "+err.Error(), http.StatusInternalServerError)
	}

}

func (ctrl *categoryController) FindByName(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")

	category, err := ctrl.service.FindByName(name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(&category); err != nil {
		http.Error(w, "response failure: "+err.Error(), http.StatusInternalServerError)
	}
}

func (ctrl *categoryController) FindById(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	category, err := ctrl.service.FindById(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(&category); err != nil {
		http.Error(w, "response failure: "+err.Error(), http.StatusInternalServerError)
	}
}

func (ctrl *categoryController) Delete(w http.ResponseWriter, r *http.Request) {
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

func (ctrl *categoryController) Update(w http.ResponseWriter, r *http.Request) {
	var category *request.CategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
	}
	updated := model.Category{
		Name: category.Name,
	}
	err := ctrl.service.Update(&updated)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(&category); err != nil {
		http.Error(w, "response failure: "+err.Error(), http.StatusInternalServerError)
	}
}
