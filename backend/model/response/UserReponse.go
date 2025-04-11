package response

import "time"

type UserResponse struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	CreatedDate time.Time `json:"created_date"`
}
