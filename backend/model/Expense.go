package model

import (
	"github.com/uptrace/bun"
	"time"
)

type Expense struct {
	bun.BaseModel `bun:"table:expenses"`

	ID          int        `bun:",pk,autoincrement" json:"id"`
	Amount      float64    `json:"amount"`
	Description string     `json:"description"`
	CategoryID  int        `json:"category_id"`
	Category    Category   `json:"-"`
	Date        time.Time  `json:"date"`
	IsRecurring bool       `json:"is_recurring"`
	BudgetID    int        `json:"budget_id"`
	BudgetPlan  BudgetPlan `json:"-"`
}
