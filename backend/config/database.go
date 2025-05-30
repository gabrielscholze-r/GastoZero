package config

import (
	"backend/model"
	"database/sql"
	"fmt"
	"os"

	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var DB *bun.DB

func ConnectDB() (*bun.DB, error) {
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	log.Info().Str("dsn", dsn).Msg("Initializing DB connection")

	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
	db := bun.NewDB(sqldb, pgdialect.New())

	db.RegisterModel((*model.BudgetPlanExpense)(nil))

	// Test connection
	if err := db.Ping(); err != nil {
		log.Error().Err(err).Msg("ERROR: Failed to ping database")
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	log.Info().Msg("Connected to Database")
	DB = db
	return db, nil
}
