package model

import "github.com/uptrace/bun"

type Category struct {
	bun.BaseModel `bun:"table:category"`

	ID   int    `bun:",pk,autoincrement" json:"id"`
	Name string `json:"name"`
}
