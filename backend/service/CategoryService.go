package service

import (
	"backend/model"
	"backend/repository"
	"errors"
)

type CategoryService interface {
	NewCategory(category *model.Category) error
	FindById(id int) (*model.Category, error)
	FindByName(name string) (*model.Category, error)
	FindAll() ([]model.Category, error)
	Update(model *model.Category) error
	Delete(id int) error
}

type categoryRepository struct {
	repository repository.CategoryRepository
}

func NewCategoryService(factory *repository.RepositoryBase) CategoryService {
	return &categoryRepository{
		repository: repository.GetByType[repository.CategoryRepository](factory),
	}
}

func (s *categoryRepository) NewCategory(category *model.Category) error {
	existing, _ := s.repository.GetByName(category.Name)
	if existing != nil {
		return errors.New("category already exists")
	}
	return s.repository.Create(category)
}

func (s *categoryRepository) FindById(id int) (*model.Category, error) {
	return s.repository.FindById(id)
}

func (s *categoryRepository) FindByName(name string) (*model.Category, error) {
	return s.repository.GetByName(name)
}

func (s *categoryRepository) FindAll() ([]model.Category, error) {
	return s.repository.FindAll()
}
func (s *categoryRepository) Update(model *model.Category) error {
	return s.repository.Update(model)
}
func (s *categoryRepository) Delete(id int) error {
	c, err := s.repository.FindById(id)
	if err != nil {
		return err
	}
	if c == nil {
		return errors.New("user not found")
	}
	return s.repository.Delete(id)
}
