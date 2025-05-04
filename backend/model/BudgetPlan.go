package model

import (
	"github.com/uptrace/bun"
	"time"
)

type BudgetPlan struct {
	bun.BaseModel `bun:"table:budget_plan"`
	ID            int        `bun:"id,pk,autoincrement" json:"id"`
	Name          string     `json:"name"`
	TotalAmount   float64    `json:"totalAmount"`
	Description   string     `json:"description"`
	CreatedDate   time.Time  `bun:"created_date" json:"startDate"`
	UserID        int        `json:"userID"`
	Expenses      []*Expense `bun:"m2m:budget_plan_expenses" json:"expenses"`
}
