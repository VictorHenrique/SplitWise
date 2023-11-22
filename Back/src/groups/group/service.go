package group

import (
	"context"
	"errors"
    "group/pkg/model"
	"database/sql"
)

type Service interface {
	RegisterGroup(ctx context.Context, token string, createGroup *model.Group) (string, error)
	DeleteGroup(ctx context.Context, username, password string) (string, error)
	ValidateToken(ctx context.Context, token string) (string, error)
}

type authRepository interface {
    GetGroupByName(ctx context.Context, groupName string) (*model.Group, error)
    CreateGroup(ctx context.Context, group *model.Group) error
	GetAllGroupsFromUser(_ context.Context, token string) ([]model.Group, error)
	CloseDB() error
}

var (
	ErrDuplicateUser = errors.New("duplicate user")
	ErrInvalidUser   = errors.New("invalid user")
	ErrInvalidToken  = errors.New("invalid token")
)

type service struct{
	repo authRepository
}

func NewService(userRepo authRepository) *service {
	return &service {repo: userRepo}
}

func (s *service) RegisterUser(ctx context.Context, createdUser *model.User) (string, error) {
	err := s.repo.CreateUser(ctx, createdUser)
	if err != nil {
		return "", ErrDuplicateUser
	}

	token, err := security.NewToken(createdUser.Username)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *service) LoginUser(ctx context.Context, username, password string) (string, error) {
	user, err := s.repo.GetUserByUsername(ctx, username)
	if user == nil || err == sql.ErrNoRows || user.Password != password  {
		return "", ErrInvalidUser
	}

	token, err := security.NewToken(user.Username)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (s *service) ValidateToken(ctx context.Context, token string) (string, error) {
	t, err := security.ParseToken(token)
	if err != nil {
		return "", ErrInvalidToken
	}

	tData, err := security.GetClaims(t)
	if err != nil {
		return "", ErrInvalidToken
	}

	return tData["username"].(string), nil
}