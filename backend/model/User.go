package model

import (
	"github.com/uptrace/bun"
	"time"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID          int       `bun:",pk,autoincrement" json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Password    string    `json:"-"`
	CreatedDate time.Time `bun:"default:current_timestamp" json:"created_date"`
}
