package main

import (
	"backend/config"
	"backend/middleware"
	"backend/repository"
	"backend/routes"
	"backend/service"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"net/http"
	"os"
)

func main() {
	// Configura saída do zerolog para o terminal com formato legível
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr}).With().Timestamp().Logger()

	log.Info().Msg("Conectando ao banco de dados")
	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal().Err(err).Msg("Erro ao conectar ao banco de dados")
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
	log.Info().Msg("Repositórios injetados com sucesso")

	// inject services
	sFactory.Init(
		service.NewUserService(repoFactory),
		service.NewCategoryService(repoFactory),
		service.NewExpensesService(repoFactory),
		service.NewBudgetPlanService(repoFactory),
	)
	log.Info().Msg("Serviços injetados com sucesso")

	// setup routes
	router := routes.SetupRoutes(sFactory)
	log.Info().Msg("Rotas configuradas")

	// apply middleware JWT
	if err := middleware.InitJWT(); err != nil {
		log.Fatal().Err(err).Msg("Erro ao inicializar JWT")
	}

	// apply cors
	cors := middleware.CORSMiddleware{BaseURL: "http://localhost:3000"}
	handlerComCors := cors.Handler(router)

	log.Info().Msg("Servidor rodando em :8080")
	if err := http.ListenAndServe(":8080", handlerComCors); err != nil {
		log.Fatal().Err(err).Msg("Erro ao subir o servidor")
	}
}
