package group

import (
	"fmt"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"groups/pkg/model"
	"net/http"
)

type Service interface {
	GetGroupByID(ctx context.Context, groupID string) (*model.Group, error)
	GetGroupsFromUser(ctx context.Context, token string) ([]model.Group, error)
	RegisterGroup(ctx context.Context, createdGroup *model.Group, membersUsernames []string) error
	DeleteGroup(ctx context.Context, groupID string, username string) error
	AddUsersToGroup(ctx context.Context, groupID string, membersUsernames []string) error
}

type groupRepository interface {
	GetGroupByID(ctx context.Context, groupID string) (*model.Group, error)
	CreateGroup(ctx context.Context, group *model.Group, membersUsernames []string) error
	DeleteGroup(ctx context.Context, groupID string, username string) error
	GetAllGroupsFromUser(ctx context.Context, username string) ([]model.Group, error)
	AddUsersToGroup(ctx context.Context, groupID string, membersUsernames []string) error
	CloseDB() error
}

var (
	ErrDuplicatedGroup = errors.New("duplicate group")
	ErrInvalidGroup    = errors.New("invalid group")
	ErrInvalidToken    = errors.New("invalid token")
)

type service struct {
	repo groupRepository
}

func NewService(groupRepo groupRepository) Service {
	return &service{repo: groupRepo}
}

func (s *service) GetGroupByID(ctx context.Context, groupID string) (*model.Group, error) {
	fmt.Println(groupID)
	group, err := s.repo.GetGroupByID(ctx, groupID)
	if err != nil {
		return nil, err
	}

	return group, err
}

func (s *service) GetGroupsFromUser(ctx context.Context, token string) ([]model.Group, error) {
	body, _ := json.Marshal(map[string]string{ "token": token })
    payload := bytes.NewBuffer(body)
	req, err := http.Post("http://localhost:8081/validate-token", "application/json", payload)

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

func (s *service) RegisterGroup(ctx context.Context, createdGroup *model.Group, membersUsernames []string) error {
	err := s.repo.CreateGroup(ctx, createdGroup, membersUsernames)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteGroup(ctx context.Context, groupID string, username string) error {
	err := s.repo.DeleteGroup(ctx, groupID, username)
	if err != nil {
		return err
	}

	return nil
}


func (s *service) AddUsersToGroup(ctx context.Context, groupID string, membersUsernames []string) error {
	err := s.repo.AddUsersToGroup(ctx, groupID, membersUsernames)
	if err != nil {
		return err
	}

	return nil
}
