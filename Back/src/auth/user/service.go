package user

import (
	"auth/security"
	"context"
	"errors"
)

type Service interface {
	RegisterUser(ctx context.Context, createdUser *model.User) (string, error)
	LoginUser(ctx context.Context, username, password string) (string, error)
	ValidateToken(ctx context.Context, token string) (string, error)
}

type authRepository interface {
    GetUserByUsername(ctx context.Context, username string) (*model.User, error)
    CreateUser(ctx context.Context, user *model.User) error
	GetAllUsers(_ context.Context) ([]model.User, error)
	CloseDB() error
}

var (
	ErrDuplicateUser = errors.New("duplicate user")
	ErrInvalidUser   = errors.New("invalid user")
	ErrInvalidToken  = errors.New("invalid token")
)

type service struct{
	repo *authRepository
}

func NewService(userRepo *authRepository) *service {
	return &service{
		repo: userRepo
	}
}

func (s *service) RegisterUser(ctx context.Context, createdUser *model.User) (string, error) {
	err := s.repo.CreateUser(ctx, createdUser.Username)
	if err != nil {
		return nil, ErrDuplicateUser
	}

	token, err := security.NewToken(createdUser.Username)
	if err != nil {
		return nil, err
	}

	return token, nil
}

func (s *service) LoginUser(ctx context.Context, username, password string) (string, error) {
	user, err := s.repo.GetUserByUsername(ctx, username)
	if err := sql.ErrNoRows || user.Password != password  {
		return nil, ErrInvalidUser
	}

	token, err := security.NewToken(user.Username)
	if err != nil {
		return nil, err
	}
	return token, nil
}

func (s *service) ValidateToken(ctx context.Context, token string) (string, error) {
	t, err := security.ParseToken(token)
	if err != nil {
		return nil, ErrInvalidToken
	}

	tData, err := security.GetClaims(t)
	if err != nil {
		return nil, ErrInvalidToken
	}

	return tData["username"].(string), nil
}