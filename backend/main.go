package main

import (
	"backend/config"
	"backend/middleware"
	"backend/repository"
	"backend/routes"
	"backend/service"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("ConnectDB")
	db, err := config.ConnectDB()
	if err != nil {
		fmt.Println(err)
		return
	}

	repoFactory := repository.NewBase()
	sFactory := service.NewBase()

	// inject repositories
	repoFactory.Init(
		repository.NewUserRepository(db),
		repository.NewBudgetPlanRepository(db),
		repository.NewCategoryRepository(db),
		repository.NewExpensesRepository(db),
	)

	// inject services
	sFactory.Init(
		service.NewUserService(repoFactory),
		service.NewCategoryService(repoFactory),
		service.NewExpensesService(repoFactory),
		service.NewBudgetPlanService(repoFactory),
	)

	// setup routes
	router := routes.SetupRoutes(sFactory)

	// apply middleware JWT
	if err := middleware.InitJWT(); err != nil {
		log.Fatal(err)
	}

	// apply cors
	cors := middleware.CORSMiddleware{BaseURL: "http://localhost:3000"}
	handlerComCors := cors.Handler(router)

	log.Println("Servidor rodando em :8080")
	if err := http.ListenAndServe(":8080", handlerComCors); err != nil {
		log.Fatal("erro ao subir servidor:", err)
	}
}
