package request

import "time"

type BudgetPlanRequest struct {
	Name        string    `json:"name"`
	TotalAmount float64   `json:"totalAmount"`
	Description string    `json:"description"`
	CreatedDate time.Time `json:"startDate"`
	UserID      int       `json:"userID"`
	Expenses    []int     `json:"expenses"`
}
