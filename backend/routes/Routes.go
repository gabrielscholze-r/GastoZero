package routes

import (
	"backend/controller"
	"backend/service"
	"github.com/gorilla/mux"
	"net/http"
)

func SetupRoutes(serviceFactory *service.ServiceBase) http.Handler {
	r := mux.NewRouter()

	userController := controller.NewUserController(serviceFactory)

	r.HandleFunc("/users", userController.CreateUser).Methods("POST")
	r.HandleFunc("/users", userController.FindByEmail).Methods("GET")

	return r
}
