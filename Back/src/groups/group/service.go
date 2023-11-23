package group

import (
	"context"
	"encoding/json"
	"errors"
	"groups/pkg/model"
	"net/http"
	"strings"
)

type Service interface {
    GetGroupByID(ctx context.Context, groupID int) (*model.Group, error)
    GetGroupsFromUser(ctx context.Context, token string) ([]model.Group, error)
	RegisterGroup(ctx context.Context, createdGroup *model.Group) error
	DeleteGroup(ctx context.Context, groupID int) error
}

type groupRepository interface {
    GetGroupByID(ctx context.Context, groupID int) (*model.Group, error)
    CreateGroup(ctx context.Context, group *model.Group) error
    DeleteGroup(ctx context.Context, groupID int) error
	GetAllGroupsFromUser(ctx context.Context, username string) ([]model.Group, error)
	CloseDB() error
}

var (
	ErrDuplicatedGroup = errors.New("duplicate group")
	ErrInvalidGroup   = errors.New("invalid group")
	ErrInvalidToken   = errors.New("invalid token")
)

type service struct{
	repo groupRepository
}

func NewService(groupRepo groupRepository) Service {
	return &service{repo: groupRepo}
}

func (s *service) GetGroupByID(ctx context.Context, groupID int) (*model.Group, error) {
    group, err := s.repo.GetGroupByID(ctx, groupID)
    if err != nil {
        return nil, err
    }

    return group, err
}

func (s *service) GetGroupsFromUser(ctx context.Context, token string) ([]model.Group, error) {
    // FIXME: this needs refactoring: Please add this to a middleware that will
    // manage the token requests.
    req, err := http.Post("http://localhost:8081/validate-token", "text/plain", strings.NewReader(token))
    if err != nil {
        return nil, err
    }
    defer req.Body.Close()
    type result struct {
        Username string `json:"username"`
    }
    var res result
    err = json.NewDecoder(req.Body).Decode(&res)
    if err != nil {
        return nil, err
    }
    username := res.Username

    groups, err := s.repo.GetAllGroupsFromUser(ctx, username)
    if err != nil {
        return nil, err
    }

    return groups, nil
}

func (s *service) RegisterGroup(ctx context.Context, createdGroup *model.Group) error {
	err := s.repo.CreateGroup(ctx, createdGroup)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteGroup(ctx context.Context, groupID int) error {
	err := s.repo.DeleteGroup(ctx, groupID)
	if err != nil {
		return err
	}

	return nil
}
