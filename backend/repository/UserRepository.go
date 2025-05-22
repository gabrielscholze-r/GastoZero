package repository

import (
	"backend/model"
	"context"

	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
)

// UserRepository defines the interface for user-related database operations.
type UserRepository interface {
	Create(user *model.User) error
	FindByID(id int) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Update(user *model.User) error
	UpdatePassword(user *model.User) error
	Delete(id int) error
}

// userRepository is the concrete implementation of UserRepository using Bun.
type userRepository struct {
	db *bun.DB
}

// NewUserRepository initializes a new instance of userRepository.
func NewUserRepository(db *bun.DB) UserRepository {
	log.Info().Msg("UserRepository initialized")
	return &userRepository{db: db}
}

// Create inserts a new User into the database and returns the created record.
func (r *userRepository) Create(user *model.User) error {
	ctx := context.Background()
	log.Debug().Msg("Creating new user")
	err := r.db.NewInsert().Model(user).Returning("*").Scan(ctx, user)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create user")
	}
	return err
}

// FindByID retrieves a User by their ID.
func (r *userRepository) FindByID(id int) (*model.User, error) {
	ctx := context.Background()
	user := new(model.User)
	log.Debug().Int("id", id).Msg("Searching for user by ID")
	err := r.db.NewSelect().Model(user).Where("id = ?", id).Scan(ctx, user)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to find user by ID")
	}
	return user, err
}

// FindByEmail retrieves a User by their email address.
func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	ctx := context.Background()
	user := new(model.User)
	log.Debug().Msg("Searching for user by email")
	err := r.db.NewSelect().Model(user).Where("email = ?", email).Scan(ctx, user)
	if err != nil {
		log.Error().Err(err).Msg("Failed to find user by email")
	}
	return user, err
}

// Update modifies the email and name of an existing User.
func (r *userRepository) Update(user *model.User) error {
	ctx := context.Background()
	log.Debug().Int("id", user.ID).Msg("Updating user email and name")
	_, err := r.db.NewUpdate().
		Model(user).
		Column("email", "name").
		Where("id = ?", user.ID).
		Exec(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", user.ID).Msg("Failed to update user")
	}
	return err
}

// UpdatePassword updates only the password of the User.
func (r *userRepository) UpdatePassword(user *model.User) error {
	ctx := context.Background()
	log.Debug().Int("id", user.ID).Msg("Updating user password")
	_, err := r.db.NewUpdate().
		Model(user).
		Column("password").
		Where("id = ?", user.ID).
		Exec(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", user.ID).Msg("Failed to update user password")
	}
	return err
}

// Delete removes a User from the database by ID.
func (r *userRepository) Delete(id int) error {
	ctx := context.Background()
	log.Debug().Int("id", id).Msg("Deleting user by ID")
	_, err := r.db.NewDelete().
		Model(&model.User{}).
		Where("id = ?", id).
		Exec(ctx)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to delete user")
	}
	return err
}
