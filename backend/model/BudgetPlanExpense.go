package model

import "github.com/uptrace/bun"

type BudgetPlanExpense struct {
	bun.BaseModel `bun:"table:budget_plan_expenses"`

	BudgetPlanID int `bun:"budget_plan_id"`
	ExpenseID    int `bun:"expense_id"`
}
