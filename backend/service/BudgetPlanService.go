package service

import (
	"backend/model"
	"backend/repository"
	"errors"
)

type BudgetPlanService interface {
	Create(b *model.BudgetPlan, email string) error
	FindByUser(id int) ([]model.BudgetPlan, error)
	Delete(id int) error
	Update(b *model.BudgetPlan) error
	UpdateAmount(id int, amount float64) error
}
type budgetPlanService struct {
	repository repository.BudgetPlanRepository
	user       repository.UserRepository
}

func NewBudgetPlanService(factory *repository.RepositoryBase) BudgetPlanService {
	return &budgetPlanService{
		repository: repository.GetByType[repository.BudgetPlanRepository](factory),
		user:       repository.GetByType[repository.UserRepository](factory),
	}
}

func (s *budgetPlanService) Create(b *model.BudgetPlan, email string) error {
	user, _ := s.user.FindByEmail(email)
	if user == nil {
		return errors.New("user does not exists")
	}
	b.UserID = user.ID
	return s.repository.Create(b)
}

func (s *budgetPlanService) FindByUser(id int) ([]model.BudgetPlan, error) {
	return s.repository.GetByUser(id)
}

func (s *budgetPlanService) Delete(id int) error {
	return s.repository.Delete(id)
}

func (s *budgetPlanService) Update(b *model.BudgetPlan) error {
	return s.repository.Update(b)
}
func (s *budgetPlanService) UpdateAmount(id int, amount float64) error {
	if _, err := s.repository.GetByID(id); err != nil {
		return err
	}
	return s.repository.UpdateAmount(id, amount)
}
