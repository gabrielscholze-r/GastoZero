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

func (r *categoryRepository) Create(category *model.Category) error {
	ctx := context.Background()
	err := r.db.NewInsert().Model(category).Returning("*").Scan(ctx, category)
	return err
}

func (r *categoryRepository) Update(category *model.Category) error {
	ctx := context.Background()
	err := r.db.NewUpdate().Model(category).Where("id = ?", category.ID).Limit(1).Scan(ctx)
	return err
}

func (r *categoryRepository) Delete(id int) error {
	ctx := context.Background()
	err := r.db.NewDelete().Model(&model.Category{}).Where("id = ?", id).Limit(1).Scan(ctx)
	return err

}

func (r *categoryRepository) FindById(id int) (*model.Category, error) {
	ctx := context.Background()
	category := new(model.Category)
	err := r.db.NewSelect().Model(category).Where("id = ?", id).Limit(1).Scan(ctx, category)
	return category, err
}

func (r *categoryRepository) FindAll() ([]model.Category, error) {
	ctx := context.Background()
	var categories []model.Category
	err := r.db.NewSelect().Model(categories).Scan(ctx, categories)
	return categories, err
}
func (r *categoryRepository) GetByName(name string) (*model.Category, error) {
	ctx := context.Background()
	category := new(model.Category)
	err := r.db.NewSelect().Model(category).Where("name = ?", name).Scan(ctx, category)
	return category, err
}
