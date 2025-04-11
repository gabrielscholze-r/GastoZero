package repository

import (
	"backend/model"
	"context"
	"github.com/uptrace/bun"
)

type UserRepository interface {
	Create(user *model.User) error
	FindByID(id string) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Update(user *model.User) error
	UpdatePassword(user *model.User) error
	Delete(id string) error
}

type userRepository struct {
	db *bun.DB
}

func NewUserRepository(db *bun.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *model.User) error {
	ctx := context.Background()
	err := r.db.NewInsert().Model(user).Returning("*").Scan(ctx, user)
	return err
}
func (r *userRepository) FindByID(id string) (*model.User, error) {
	ctx := context.Background()
	user := new(model.User)
	err := r.db.NewSelect().Model(user).Where("id = ?", id).Limit(1).Scan(ctx, user)
	return user, err
}
func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	ctx := context.Background()
	user := new(model.User)
	err := r.db.NewSelect().Model(user).Where("email = ?", email).Limit(1).Scan(ctx, user)
	return user, err
}
func (r *userRepository) Update(user *model.User) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(user).Where("id = ?", user.ID).Limit(1).Exec(ctx)
	return err
}
func (r *userRepository) UpdatePassword(user *model.User) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(user).Column("password").Where("id = ?", user.ID).Exec(ctx)
	return err
}

func (r *userRepository) Delete(id string) error {
	ctx := context.Background()
	_, err := r.db.NewDelete().Model(&model.User{}).Where("id = ?", id).Limit(1).Exec(ctx)
	return err
}
