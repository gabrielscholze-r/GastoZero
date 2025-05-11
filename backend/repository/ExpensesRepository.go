package repository

import (
	"backend/model"
	"context"
	"github.com/uptrace/bun"
)

type ExpensesRepository interface {
	Create(category *model.Expense) error
	Update(category *model.Expense) error
	Delete(id int) error
	GetByPlan(id int) ([]model.Expense, error)
	GetByCategory(id int) ([]model.Expense, error)
}

type expensesRepository struct {
	db *bun.DB
}

func NewExpensesRepository(db *bun.DB) ExpensesRepository {
	return &expensesRepository{db: db}
}

// Create inserts a new Expense into the database and links it to a BudgetPlan.
func (r *expensesRepository) Create(expense *model.Expense) error {
	ctx := context.Background()
	if err := r.db.NewInsert().Model(expense).Returning("*").Scan(ctx, expense); err != nil {
		return err
	}
	link := &model.BudgetPlanExpense{
		BudgetPlanID: expense.BudgetID,
		ExpenseID:    expense.ID,
	}
	_, err := r.db.NewInsert().Model(link).Exec(ctx)
	return err
}

// Update modifies an existing Expense based on its ID.
func (r *expensesRepository) Update(expense *model.Expense) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(expense).Where("id = ?", expense.ID).Exec(ctx)
	return err
}

// Delete removes an Expense and its association from the BudgetPlanExpense table.
func (r *expensesRepository) Delete(id int) error {
	ctx := context.Background()

	_, err := r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("expense_id = ?", id).
		Exec(ctx)
	if err != nil {
		return err
	}

	_, err = r.db.NewDelete().
		Model(&model.Expense{}).
		Where("id = ?", id).
		Exec(ctx)
	return err
}

// GetByPlan retrieves all Expenses associated with a specific BudgetPlan ID.
func (r *expensesRepository) GetByPlan(id int) ([]model.Expense, error) {
	ctx := context.Background()
	var expenses []model.Expense
	err := r.db.NewSelect().Model(&expenses).Where("budget_id = ?", id).Scan(ctx)
	return expenses, err
}

// GetByCategory retrieves all Expenses that belong to a specific Category ID.
func (r *expensesRepository) GetByCategory(id int) ([]model.Expense, error) {
	ctx := context.Background()
	var expenses []model.Expense
	err := r.db.NewSelect().Model(&expenses).Where("categoryID = ?", id).Scan(ctx, expenses)
	if len(expenses) == 0 {
		return nil, err
	}
	return expenses, err
}
