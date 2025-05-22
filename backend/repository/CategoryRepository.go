package repository

import (
	"backend/model"
	"context"
	"database/sql"
	"errors"
	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
	"strings"
)

type CategoryRepository interface {
	Create(category *model.Category) error
	Update(category *model.Category) error
	Delete(id int) error
	FindById(id int) (*model.Category, error)
	FindAll() ([]model.Category, error)
	GetByName(name string) (*model.Category, error)
}

type categoryRepository struct {
	db *bun.DB
}

func NewCategoryRepository(db *bun.DB) CategoryRepository {
	log.Info().Msg("Initializing CategoryRepository")
	return &categoryRepository{db: db}
}

// Create inserts a new Category into the database and returns the created record.
func (r *categoryRepository) Create(category *model.Category) error {
	log.Info().Str("name", category.Name).Msg("Creating category")
	ctx := context.Background()
	err := r.db.NewInsert().Model(category).Returning("*").Scan(ctx, category)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create category")
	} else {
		log.Info().Int("id", category.ID).Msg("Category created successfully")
	}
	return err
}

// Update modifies an existing Category based on its ID.
func (r *categoryRepository) Update(category *model.Category) error {
	log.Info().Int("id", category.ID).Msg("Updating category")
	ctx := context.Background()
	err := r.db.NewUpdate().Model(category).Where("id = ?", category.ID).Scan(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", category.ID).Msg("Failed to update category")
	} else {
		log.Info().Int("id", category.ID).Msg("Category updated successfully")
	}
	return err
}

// Delete removes a Category by its ID.
func (r *categoryRepository) Delete(id int) error {
	log.Info().Int("id", id).Msg("Deleting category")
	ctx := context.Background()
	err := r.db.NewDelete().Model(&model.Category{}).Where("id = ?", id).Scan(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to delete category")
	} else {
		log.Info().Int("id", id).Msg("Category deleted successfully")
	}
	return err
}

// FindById retrieves a Category by its ID.
func (r *categoryRepository) FindById(id int) (*model.Category, error) {
	log.Info().Int("id", id).Msg("Fetching category by ID")
	ctx := context.Background()
	category := new(model.Category)
	err := r.db.NewSelect().Model(category).Where("id = ?", id).Scan(ctx, category)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to fetch category by ID")
		return nil, err
	}
	log.Info().Int("id", category.ID).Msg("Category fetched successfully")
	return category, nil
}

// FindAll fetches all categories from the database.
func (r *categoryRepository) FindAll() ([]model.Category, error) {
	log.Info().Msg("Fetching all categories")
	ctx := context.Background()
	var categories []model.Category
	err := r.db.NewSelect().Model(&categories).Scan(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch categories")
	} else {
		log.Info().Int("count", len(categories)).Msg("Categories fetched successfully")
	}
	return categories, err
}

// GetByName fetches a Category by its name.
func (r *categoryRepository) GetByName(name string) (*model.Category, error) {
	log.Info().Str("name", name).Msg("Fetching category by name")
	ctx := context.Background()
	category := new(model.Category)

	err := r.db.NewSelect().
		Model(category).
		Where("name = ?", name).
		Scan(ctx)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) || strings.Contains(err.Error(), "no rows in result set") {
			log.Warn().Str("name", name).Msg("Category not found")
			return nil, nil
		}
		log.Error().Err(err).Str("name", name).Msg("Failed to fetch category by name")
		return nil, err
	}

	log.Info().Int("id", category.ID).Str("name", name).Msg("Category fetched successfully")
	return category, nil
}
