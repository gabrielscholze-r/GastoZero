package repository

import (
	"backend/model"
	"context"
	"github.com/uptrace/bun"
)

type UserRepository interface {
	Create(user *model.User) error
	FindByID(id int) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Update(user *model.User) error
	UpdatePassword(user *model.User) error
	Delete(id int) error
}
type userRepository struct {
	db *bun.DB
}

func NewUserRepository(db *bun.DB) UserRepository {
	return &userRepository{db: db}
}

// Create inserts a new User into the database and returns the created record.
func (r *userRepository) Create(user *model.User) error {
	ctx := context.Background()
	err := r.db.NewInsert().Model(user).Returning("*").Scan(ctx, user)
	return err
}

// FindByID retrieves a User by their ID.
func (r *userRepository) FindByID(id int) (*model.User, error) {
	ctx := context.Background()
	user := new(model.User)
	err := r.db.NewSelect().Model(user).Where("id = ?", id).Scan(ctx, user)
	return user, err
}

// FindByEmail retrieves a User by their email address.
func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	ctx := context.Background()
	user := new(model.User)
	err := r.db.NewSelect().Model(user).Where("email = ?", email).Scan(ctx, user)
	return user, err
}

// Update modifies the email and name of an existing User.
func (r *userRepository) Update(user *model.User) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(user).Column("email").Column("name").Where("id = ?", user.ID).Exec(ctx)
	return err
}

// UpdatePassword updates only the password of the User.
func (r *userRepository) UpdatePassword(user *model.User) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().Model(user).Column(" password").Where("id = ?", user.ID).Exec(ctx)
	return err
}

// Delete removes a User from the database by ID.
func (r *userRepository) Delete(id int) error {
	ctx := context.Background()
	_, err := r.db.NewDelete().Model(&model.User{}).Where("id = ?", id).Exec(ctx)
	return err
}
