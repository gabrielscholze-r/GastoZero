package request

import "time"

type ExpenseRequest struct {
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	CategoryID  int       `json:"category_id"`
	Date        time.Time `json:"date"`
	IsRecurring bool      `json:"is_recurring"`
	BudgetID    int       `json:"budget_id"`
}
