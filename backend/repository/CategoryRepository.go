package repository

import (
	"backend/model"
	"context"
	"github.com/uptrace/bun"
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
	return &categoryRepository{db: db}
}

// Create inserts a new Category into the database and returns the created record.
func (r *categoryRepository) Create(category *model.Category) error {
	ctx := context.Background()
	err := r.db.NewInsert().Model(category).Returning("*").Scan(ctx, category)
	return err
}

// Update modifies an existing Category based on its ID.
func (r *categoryRepository) Update(category *model.Category) error {
	ctx := context.Background()
	err := r.db.NewUpdate().Model(category).Where("id = ?", category.ID).Scan(ctx)
	return err
}

// Delete removes a Category by its ID.
func (r *categoryRepository) Delete(id int) error {
	ctx := context.Background()
	err := r.db.NewDelete().Model(&model.Category{}).Where("id = ?", id).Scan(ctx)
	return err
}

// FindById retrieves a Category by its ID.
func (r *categoryRepository) FindById(id int) (*model.Category, error) {
	ctx := context.Background()
	category := new(model.Category)
	err := r.db.NewSelect().Model(category).Where("id = ?", id).Scan(ctx, category)
	return category, err
}

// FindAll fetches all categories from the database.
func (r *categoryRepository) FindAll() ([]model.Category, error) {
	ctx := context.Background()
	var categories []model.Category
	err := r.db.NewSelect().Model(categories).Scan(ctx, categories)
	return categories, err
}

// GetByName fetches a Category by its name.
func (r *categoryRepository) GetByName(name string) (*model.Category, error) {
	ctx := context.Background()
	category := new(model.Category)
	err := r.db.NewSelect().Model(category).Where("name = ?", name).Scan(ctx, category)
	return category, err
}
