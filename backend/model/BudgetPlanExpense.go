package model

import "github.com/uptrace/bun"

type BudgetPlanExpense struct {
	bun.BaseModel `bun:"table:budget_plan_expenses"`

	BudgetPlanID int         `bun:"budget_plan_id"`
	BudgetPlan   *BudgetPlan `bun:"rel:belongs-to,join:budget_plan_id=id"`

	ExpenseID int      `bun:"expense_id"`
	Expense   *Expense `bun:"rel:belongs-to,join:expense_id=id"`
}
