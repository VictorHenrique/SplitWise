package auth

import (
    "context"
    "errors"

    "splitwise/auth/internal/repository"
    "splitwise/auth/pkg/model"
)

var ErrNotFound = errors.New("not found")

type authRepository interface {
    GetUserByUsername(ctx context.Context, username string) (*model.User, error)
    CreateUser(ctx context.Context, user *model.User) error
}

type Controller struct {
    repo authRepository
}

func New(repo authRepository) *Controller {
    return &Controller{repo}
}

func (c *Controller) Get(ctx context.Context, username string) (*model.User, error) {
    res, err := c.repo.GetUserByUsername(ctx, username)
    if err != nil && errors.Is(err, repository.ErrNotFound) {
        return nil, ErrNotFound
    }
    return res, err
}

func (c *Controller) Put(ctx context.Context, user *model.User) error {
    err := c.repo.CreateUser(ctx, user)
    if err != nil {
        return err
    }
    return nil
}

