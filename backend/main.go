package main

import (
	"backend/config"
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
		return
	}

	repoFactory := repository.NewBase()
	sFactory := service.NewBase()

	// inject repositories
	repoFactory.Init(repository.NewUserRepository(db),
		repository.NewBudgetPlanRepository(db),
		repository.NewCategoryRepository(db),
		repository.NewExpensesRepository(db))

	// inject services
	sFactory.Init(
		service.NewUserService(repoFactory),
		service.NewCategoryService(repoFactory),
		service.NewExpensesService(repoFactory),
		service.NewBudgetPlanService(repoFactory))

	router := routes.SetupRoutes(sFactory)

	log.Println("Servidor rodando em :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal("erro ao subir servidor:", err)
	}
}
