package repository

import (
	"backend/model"
	"context"
	"github.com/uptrace/bun"
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

func (r *budgetPlanRepository) Create(plan *model.BudgetPlan) error {
	ctx := context.Background()
	err := r.db.NewInsert().Model(plan).Returning("*").Scan(ctx, plan)
	return err
}

func (r *budgetPlanRepository) Delete(id int) error {
	ctx := context.Background()

	// Remove vínculos da tabela intermediária
	if _, err := r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("budget_plan_id = ?", id).
		Exec(ctx); err != nil {
		return err
	}

	// Remove o plano
	_, err := r.db.NewDelete().
		Model(&model.BudgetPlan{}).
		Where("id = ?", id).
		Limit(1).
		Exec(ctx)
	return err
}

func (r *budgetPlanRepository) GetByUser(userID int) ([]model.BudgetPlan, error) {
	ctx := context.Background()
	var plans []model.BudgetPlan

	// Preload dos expenses usando m2m
	err := r.db.NewSelect().
		Model(&plans).
		Relation("Expenses").
		Where("budget_plan.user_id = ?", userID).
		Scan(ctx)

	return plans, err
}

func (r *budgetPlanRepository) UpdateAmount(id int, newAmount float64) error {
	plan := &model.BudgetPlan{ID: id, TotalAmount: newAmount}
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(plan).Column("total_amount").Where("id = ?", id).Exec(ctx)
	return err
}

func (r *budgetPlanRepository) Update(plan *model.BudgetPlan) error {
	ctx := context.Background()

	// Atualiza os dados básicos
	_, err := r.db.NewUpdate().Model(plan).Where("id = ?", plan.ID).Limit(1).Exec(ctx)
	if err != nil {
		return err
	}

	// Atualiza os vínculos de expenses: remove todos e insere novamente
	_, err = r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("budget_plan_id = ?", plan.ID).
		Exec(ctx)
	if err != nil {
		return err
	}

	for _, expense := range plan.Expenses {
		link := &model.BudgetPlanExpense{
			BudgetPlanID: plan.ID,
			ExpenseID:    expense,
		}
		if _, err := r.db.NewInsert().Model(link).Exec(ctx); err != nil {
			return err
		}
	}

	return nil
}

func (r *budgetPlanRepository) GetByID(id int) (*model.BudgetPlan, error) {
	ctx := context.Background()
	plan := new(model.BudgetPlan)

	err := r.db.NewSelect().
		Model(plan).
		Relation("Expenses").
		Where("budget_plan.id = ?", id).
		Limit(1).
		Scan(ctx)
	return plan, err
}

func (r *budgetPlanRepository) DeleteExpense(budgetID int, expenseID int) error {
	ctx := context.Background()
	_, err := r.db.NewDelete().
		Model((*model.BudgetPlanExpense)(nil)).
		Where("budget_plan_id = ? AND expense_id = ?", budgetID, expenseID).
		Exec(ctx)
	return err
}
