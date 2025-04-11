package routes

import (
	"backend/controller"
	"backend/middleware"
	"backend/service"
	"github.com/gorilla/mux"
	"net/http"
)

func SetupRoutes(serviceFactory *service.ServiceBase) http.Handler {
	r := mux.NewRouter()

	userController := controller.NewUserController(serviceFactory)

	r.HandleFunc("/users", userController.CreateUser).Methods("POST")
	r.HandleFunc("/users", userController.FindByEmail).Methods("GET")
	r.HandleFunc("/users/login", userController.Login).Methods("POST")
	r.HandleFunc("/users/password", middleware.JWTAuth(userController.UpdatePassword)).Methods("PUT")
	r.HandleFunc("/users", middleware.JWTAuth(userController.Delete)).Methods("DELETE")
	r.HandleFunc("/users", middleware.JWTAuth(userController.Update)).Methods("PUT")

	categoryController := controller.NewCategoryController(serviceFactory)
	r.HandleFunc("/category", categoryController.CreateCategory).Methods("POST")
	r.HandleFunc("/category/id", categoryController.FindById).Methods("GET")
	r.HandleFunc("/category/name", categoryController.FindByName).Methods("GET")
	r.HandleFunc("/category", categoryController.Update).Methods("PUT")
	r.HandleFunc("/category", categoryController.Delete).Methods("DELETE")

	return r
}
