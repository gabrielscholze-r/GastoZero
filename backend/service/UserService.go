package service

import (
	"backend/middleware"
	"backend/model"
	"backend/model/request"
	"backend/repository"
	"backend/util"
	"errors"
	"time"
)

type UserService interface {
	GetUserByID(id string) (*model.User, error)
	CreateUser(user *model.User) error
	FindByEmail(email string) (*model.User, error)
	UpdatePassword(user *model.User, password string) error
	Update(user *model.User) error
	Delete(id string) error
	Login(user *request.LoginRequest) (string, error)
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
	newPassword, hashErr := util.HashPassword(user.Password)
	if hashErr != nil {
		return hashErr
	}
	user.Password = newPassword
	user.CreatedDate = time.Now()
	err := s.repository.Create(user)
	return err
}

func (s *userService) GetUserByID(id string) (*model.User, error) {
	return s.repository.FindByID(id)
}

func (s *userService) FindByEmail(email string) (*model.User, error) {
	return s.repository.FindByEmail(email)
}

func (s *userService) UpdatePassword(user *model.User, password string) error {
	if util.VerifyPassword(password, user.Password) {
		return errors.New("please enter a different password")
	}
	passwordHash, hasErr := util.HashPassword(password)
	if hasErr != nil {
		return hasErr
	}
	user.Password = passwordHash
	err := s.repository.UpdatePassword(user)
	return err
}

func (s *userService) Update(user *model.User) error {
	err := s.repository.Update(user)
	return err
}
func (s *userService) Delete(id string) error {
	u, err := s.repository.FindByID(id)
	if err != nil {
		return err
	}
	if u == nil {
		return errors.New("user not found")
	}
	err = s.repository.Delete(id)
	return err
}

func (s *userService) Login(u *request.LoginRequest) (string, error) {

	user, err := s.repository.FindByEmail(u.Email)
	if err != nil {
		return "", err
	}
	isValid := util.VerifyPassword(u.Password, user.Password)
	if !isValid {
		return "", errors.New("invalid email or password")
	}
	token, err := middleware.GenerateJWT(u.Email)
	if err != nil {
		return "", errors.New("error generating token")
	}
	return token, nil
}
