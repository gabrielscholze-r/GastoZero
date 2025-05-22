package repository

import (
	"backend/model"
	"context"
	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
)

type ExpensesRepository interface {
	Create(expense *model.Expense) error
	Update(expense *model.Expense) error
	Delete(id int) error
	GetByPlan(id int) ([]model.Expense, error)
	GetByCategory(id int) ([]model.Expense, error)
}

type expensesRepository struct {
	db *bun.DB
}

func NewExpensesRepository(db *bun.DB) ExpensesRepository {
	log.Info().Msg("Initializing ExpensesRepository")
	return &expensesRepository{db: db}
}

// Create inserts a new Expense into the database and links it to a BudgetPlan.
func (r *expensesRepository) Create(expense *model.Expense) error {
	log.Info().Str("description", expense.Description).Int("budget_id", expense.BudgetID).Msg("Creating expense and linking to budget plan")
	ctx := context.Background()

	if err := r.db.NewInsert().Model(expense).Returning("*").Scan(ctx, expense); err != nil {
		log.Error().Err(err).Msg("Failed to create expense")
		return err
	}

	link := &model.BudgetPlanExpense{
		BudgetPlanID: expense.BudgetID,
		ExpenseID:    expense.ID,
	}
	_, err := r.db.NewInsert().Model(link).Exec(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Failed to link expense to budget plan")
	} else {
		log.Info().Int("expense_id", expense.ID).Int("budget_plan_id", expense.BudgetID).Msg("Expense linked to budget plan successfully")
	}
	return err
}

// Update modifies an existing Expense based on its ID.
func (r *expensesRepository) Update(expense *model.Expense) error {
	log.Info().Int("id", expense.ID).Msg("Updating expense")
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(expense).Where("id = ?", expense.ID).Exec(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", expense.ID).Msg("Failed to update expense")
	} else {
		log.Info().Int("id", expense.ID).Msg("Expense updated successfully")
	}
	return err
}

// Delete removes an Expense and its association from the BudgetPlanExpense table.
func (r *expensesRepository) Delete(id int) error {
	log.Info().Int("id", id).Msg("Deleting expense and removing budget plan association")
	ctx := context.Background()

	_, err := r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("expense_id = ?", id).
		Exec(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to delete expense association from BudgetPlanExpense")
		return err
	}

	_, err = r.db.NewDelete().
		Model(&model.Expense{}).
		Where("id = ?", id).
		Exec(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to delete expense")
	} else {
		log.Info().Int("id", id).Msg("Expense deleted successfully")
	}
	return err
}

// GetByPlan retrieves all Expenses associated with a specific BudgetPlan ID.
func (r *expensesRepository) GetByPlan(id int) ([]model.Expense, error) {
	log.Info().Int("budget_id", id).Msg("Fetching expenses by budget plan")
	ctx := context.Background()
	var expenses []model.Expense
	err := r.db.NewSelect().Model(&expenses).Where("budget_id = ?", id).Scan(ctx)
	if err != nil {
		log.Error().Err(err).Int("budget_id", id).Msg("Failed to fetch expenses by budget plan")
	} else {
		log.Info().Int("budget_id", id).Int("count", len(expenses)).Msg("Expenses fetched by budget plan")
	}
	return expenses, err
}

// GetByCategory retrieves all Expenses that belong to a specific Category ID.
func (r *expensesRepository) GetByCategory(id int) ([]model.Expense, error) {
	log.Info().Int("category_id", id).Msg("Fetching expenses by category")
	ctx := context.Background()
	var expenses []model.Expense
	err := r.db.NewSelect().Model(&expenses).Where("categoryID = ?", id).Scan(ctx)
	if err != nil {
		log.Error().Err(err).Int("category_id", id).Msg("Failed to fetch expenses by category")
		return nil, err
	}
	log.Info().Int("category_id", id).Int("count", len(expenses)).Msg("Expenses fetched by category")
	return expenses, nil
}
