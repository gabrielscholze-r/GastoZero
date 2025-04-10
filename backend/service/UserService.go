package service

import (
	"backend/auth"
	"backend/model"
	"backend/repository"
	"errors"
	"time"
)

type UserService interface {
	GetUserByID(id int) (*model.User, error)
	CreateUser(user *model.User) error
	FindByEmail(email string) (*model.User, error)
	UpdatePassword(id int, password string) error
	Update(user *model.User) error
	Delete(id int) error
}

type userService struct {
	repository repository.UserRepository
}

func NewUserService(factory *repository.RepositoryBase) UserService {
	return &userService{
		repository: repository.GetByType[repository.UserRepository](factory),
	}
}

func (s *userService) CreateUser(user *model.User) error {
	_, uErr := s.repository.FindByEmail(user.Email)
	if uErr == nil {
		return errors.New("email already in use")
	}
	newPassword, hashErr := auth.HashPassword(user.Password)
	if hashErr != nil {
		return hashErr
	}
	user.Password = newPassword
	user.CreatedDate = time.Now()
	err := s.repository.Create(user)
	return err
}

func (s *userService) GetUserByID(id int) (*model.User, error) {
	return s.repository.FindByID(id)
}

func (s *userService) FindByEmail(email string) (*model.User, error) {
	return s.repository.FindByEmail(email)
}

func (s *userService) UpdatePassword(id int, password string) error {
	u, _ := s.repository.FindByID(id)
	if u == nil {
		return errors.New("user not found")
	}
	passwordHash, hasErr := auth.HashPassword(password)
	if hasErr != nil {
		return hasErr
	}
	u.Password = passwordHash
	err := s.repository.UpdatePassword(u)
	return err
}

func (s *userService) Update(user *model.User) error {
	err := s.repository.Update(user)
	return err
}
func (s *userService) Delete(id int) error {
	err := s.repository.Delete(id)
	return err
}

//todo authentication
