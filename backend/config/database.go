package config

import (
	"backend/model"
	"context"
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var DB *bun.DB

func ConnectDB() (*bun.DB, error) {
	// Load environment variables
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {
		return nil, fmt.Errorf("missing required environment variables")
	}

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbUser,
		dbPassword,
		dbHost,
		dbPort,
		dbName,
	)

	log.Info().Str("dsn", dsn).Msg("Initializing PostgreSQL connection")

	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
	db := bun.NewDB(sqldb, pgdialect.New())

	DB = db
	db.RegisterModel((*model.BudgetPlanExpense)(nil)) // Register your model

	if err := db.Ping(); err != nil {
		log.Error().Err(err).Msg("Failed to ping database")
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	log.Info().Msg("Successfully connected to PostgreSQL using Bun")

	// Try running the SQL script, but don't fail if there's an error
	if err := runSchemaScript(db); err != nil {
		log.Warn().Err(err).Msg("Schema SQL script failed, continuing anyway")
	}

	return db, nil
}

func runSchemaScript(db *bun.DB) error {
	sqlPath := filepath.Join("config", "tables.sql")

	content, err := os.ReadFile(sqlPath)
	if err != nil {
		return fmt.Errorf("failed to read SQL file: %v", err)
	}

	log.Debug().Msg("Running SQL schema script...")

	res, err := db.ExecContext(context.Background(), string(content))
	if err != nil {
		return fmt.Errorf("failed to execute SQL script: %w", err)
	}

	rowsAffected, _ := res.RowsAffected()
	log.Info().Int64("rowsAffected", rowsAffected).Str("file", sqlPath).Msg("Schema SQL script executed successfully")

	return nil
}
