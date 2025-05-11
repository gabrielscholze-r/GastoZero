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
	r.HandleFunc("/category", middleware.JWTAuth(categoryController.CreateCategory)).Methods("POST")
	r.HandleFunc("/category/id", middleware.JWTAuth(categoryController.FindById)).Methods("GET")
	r.HandleFunc("/category/name", middleware.JWTAuth(categoryController.FindByName)).Methods("GET")
	r.HandleFunc("/category", middleware.JWTAuth(categoryController.Update)).Methods("PUT")
	r.HandleFunc("/category", middleware.JWTAuth(categoryController.Delete)).Methods("DELETE")
	r.HandleFunc("/category", middleware.JWTAuth(categoryController.GetAll)).Methods("GET")

	expenseController := controller.NewExpenseController(serviceFactory)
	r.HandleFunc("/expense", middleware.JWTAuth(expenseController.NewExpense)).Methods("POST")
	r.HandleFunc("/expense/plan", middleware.JWTAuth(expenseController.GetByPlan)).Methods("GET")
	r.HandleFunc("/expense/category", middleware.JWTAuth(expenseController.GetByCategory)).Methods("GET")
	r.HandleFunc("/expense", middleware.JWTAuth(expenseController.Update)).Methods("PUT")
	r.HandleFunc("/expense", middleware.JWTAuth(expenseController.Delete)).Methods("DELETE")

	budgetController := controller.NewBudgetPlanController(serviceFactory)
	r.HandleFunc("/plan", middleware.JWTAuth(budgetController.CreatePlan)).Methods("POST")
	r.HandleFunc("/plan/user", middleware.JWTAuth(budgetController.GetByUser)).Methods("GET")
	r.HandleFunc("/plan", middleware.JWTAuth(budgetController.Delete)).Methods("DELETE")
	r.HandleFunc("/plan/amount", middleware.JWTAuth(budgetController.UpdateAmount)).Methods("PUT")
	r.HandleFunc("/plan", middleware.JWTAuth(budgetController.Update)).Methods("PUT")

	return r
}
