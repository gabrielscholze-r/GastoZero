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

	return r
}
