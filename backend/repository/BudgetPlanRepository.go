package repository

import (
	"backend/model"
	"context"
	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
	//"log"
)

type BudgetPlanRepository interface {
	Create(plan *model.BudgetPlan) error
	Delete(id int) error
	GetByUser(id int) ([]model.BudgetPlan, error)
	UpdateAmount(id int, newAmount float64) error
	Update(model *model.BudgetPlan) error
	GetByID(id int) (*model.BudgetPlan, error)
	DeleteExpense(id int, expenseID int) error
}

type budgetPlanRepository struct {
	db *bun.DB
}

func NewBudgetPlanRepository(db *bun.DB) BudgetPlanRepository {
	return &budgetPlanRepository{db: db}
}

// Create inserts a new BudgetPlan into the database and returns the created plan.
func (r *budgetPlanRepository) Create(plan *model.BudgetPlan) error {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "Create").Logger()
	logger.Info().Int("user_id", plan.UserID).Msg("Creating Budget Plan")

	err := r.db.NewInsert().Model(plan).Returning("*").Scan(ctx, plan)
	if err != nil {
		logger.Error().Err(err).Msg("Failed to create Budget Plan")
		return err
	}

	logger.Info().Int("budget_plan_id", plan.ID).Msg("Budget Plan created successfully")
	return nil
}

// Delete removes a BudgetPlan by ID and deletes all associated BudgetPlanExpense links.
func (r *budgetPlanRepository) Delete(id int) error {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "Delete").Int("budget_plan_id", id).Logger()
	logger.Info().Msg("Deleting Budget Plan")

	if _, err := r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("budget_plan_id = ?", id).
		Exec(ctx); err != nil {
		logger.Error().Err(err).Msg("Failed to delete related BudgetPlanExpense")
		return err
	}

	if _, err := r.db.NewDelete().
		Model(&model.BudgetPlan{}).
		Where("id = ?", id).
		Exec(ctx); err != nil {
		logger.Error().Err(err).Msg("Failed to delete Budget Plan")
		return err
	}

	logger.Info().Msg("Budget Plan deleted successfully")
	return nil
}

// GetByUser fetches all BudgetPlans that belong to a specific user.
func (r *budgetPlanRepository) GetByUser(userID int) ([]model.BudgetPlan, error) {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "GetByUser").Int("user_id", userID).Logger()
	logger.Info().Msg("Fetching Budget Plans by user")

	var plans []model.BudgetPlan
	err := r.db.NewSelect().
		Model(&plans).
		Relation("Expenses").
		Where("budget_plan.user_id = ?", userID).
		Scan(ctx)
	if err != nil {
		logger.Error().Err(err).Msg("Failed to fetch Budget Plans by user")
		return nil, err
	}

	logger.Info().Int("count", len(plans)).Msg("Fetched Budget Plans successfully")
	return plans, nil
}

// UpdateAmount updates only the total amount of a BudgetPlan.
func (r *budgetPlanRepository) UpdateAmount(id int, newAmount float64) error {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "UpdateAmount").Int("budget_plan_id", id).Float64("new_amount", newAmount).Logger()
	logger.Info().Msg("Updating Budget Plan amount")

	plan := &model.BudgetPlan{ID: id, TotalAmount: newAmount}
	if _, err := r.db.NewUpdate().Model(plan).Column("total_amount").Where("id = ?", id).Exec(ctx); err != nil {
		logger.Error().Err(err).Msg("Failed to update Budget Plan amount")
		return err
	}

	logger.Info().Msg("Budget Plan amount updated successfully")
	return nil
}

// Update replaces the existing BudgetPlan data and its related expenses.
func (r *budgetPlanRepository) Update(plan *model.BudgetPlan) error {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "Update").Int("budget_plan_id", plan.ID).Logger()
	logger.Info().Msg("Updating Budget Plan")

	if _, err := r.db.NewUpdate().Model(plan).
		Column("name", "description").
		Where("id = ?", plan.ID).
		Exec(ctx); err != nil {
		logger.Error().Err(err).Msg("Failed to update Budget Plan")
		return err
	}

	logger.Info().Msg("Budget Plan updated successfully")
	return nil
}

// GetByID retrieves a BudgetPlan by its ID along with its related expenses.
func (r *budgetPlanRepository) GetByID(id int) (*model.BudgetPlan, error) {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "GetByID").Int("budget_plan_id", id).Logger()
	logger.Info().Msg("Fetching Budget Plan by ID")

	plan := new(model.BudgetPlan)
	err := r.db.NewSelect().
		Model(plan).
		Relation("Expenses").
		Where("budget_plan.id = ?", id).
		Scan(ctx)
	if err != nil {
		logger.Error().Err(err).Msg("Failed to fetch Budget Plan by ID")
		return nil, err
	}

	logger.Info().Msg("Fetched Budget Plan successfully")
	return plan, nil
}

// DeleteExpense removes the relationship between a BudgetPlan and an Expense.
func (r *budgetPlanRepository) DeleteExpense(budgetID int, expenseID int) error {
	ctx := context.Background()
	logger := log.With().Str("component", "BudgetPlanRepository").Str("method", "DeleteExpense").
		Int("budget_plan_id", budgetID).Int("expense_id", expenseID).Logger()
	logger.Info().Msg("Deleting Expense from Budget Plan")

	if _, err := r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("budget_plan_id = ? AND expense_id = ?", budgetID, expenseID).
		Exec(ctx); err != nil {
		logger.Error().Err(err).Msg("Failed to delete Expense from Budget Plan")
		return err
	}

	logger.Info().Msg("Expense deleted from Budget Plan successfully")
	return nil
}
