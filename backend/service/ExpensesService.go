package service

import (
	"backend/model"
	"backend/repository"
	"errors"
)

type ExpensesService interface {
	NewExpense(expense *model.Expense) error
	DeleteExpense(id int, plan int) error
	GetByPlan(id int) ([]model.Expense, error)
	GetByCategory(id int) ([]model.Expense, error)
	Update(model *model.Expense) error
}

type expensesRepository struct {
	repository repository.ExpensesRepository
	budget     repository.BudgetPlanRepository
	category   repository.CategoryRepository
}

func NewExpensesService(factory *repository.RepositoryBase) ExpensesService {
	return &expensesRepository{
		repository: repository.GetByType[repository.ExpensesRepository](factory),
		budget:     repository.GetByType[repository.BudgetPlanRepository](factory),
		category:   repository.GetByType[repository.CategoryRepository](factory),
	}
}

func (s *expensesRepository) NewExpense(expense *model.Expense) error {
	b, _ := s.budget.GetByID(expense.BudgetID)
	if &b == nil {
		return errors.New("budget not found")
	}
	c, _ := s.category.FindById(expense.CategoryID)

	if &c == nil {
		return errors.New("category not found")
	}
	return s.repository.Create(expense)
}

func (s *expensesRepository) DeleteExpense(id int, plan int) error {
	bError := s.budget.DeleteExpense(plan, id)
	if bError != nil {
		return bError
	}
	err := s.repository.Delete(id)
	return err
}

func (s *expensesRepository) GetByPlan(id int) ([]model.Expense, error) {
	return s.repository.GetByPlan(id)
}

func (s *expensesRepository) GetByCategory(id int) ([]model.Expense, error) {
	return s.repository.GetByCategory(id)
}

func (s *expensesRepository) Update(model *model.Expense) error {
	return s.repository.Update(model)
}
