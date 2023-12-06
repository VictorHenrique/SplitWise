package connection

import (
	"connections/pkg/model"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type Service interface {
	GetConnectionsFromUser(ctx context.Context, token string) ([]model.Connection, error)
	RegisterConnection(ctx context.Context, createdConnection *model.Connection) error
	DeleteConnection(ctx context.Context, token string, friendUsername string) error
}

type groupRepository interface {
	CreateConnection(ctx context.Context, connection *model.Connection) error
	DeleteConnection(ctx context.Context, username string, friendUsername string) error
	GetAllConnectionsFromUser(ctx context.Context, username string) ([]model.Connection, error)
	CloseDB() error
}

var (
	ErrDuplicatedConnection = errors.New("duplicate connection")
	ErrInvalidConnection    = errors.New("invalid connection")
	ErrInvalidToken         = errors.New("invalid token")
)

type service struct {
	repo connectionRepository
}

func NewService(connectionRepo connectionRepository) Service {
	return &service{repo: connectionRepo}
}

func (s *service) GetConnectionsFromUser(ctx context.Context, token string) ([]model.Group, error) {
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

	connections, err := s.repo.GetAllConnectionsFromUser(ctx, username)
	if err != nil {
		return nil, err
	}

	return connections, nil
}

func (s *service) RegisterConnection(ctx context.Context, createdConnection *model.Connection) error {
	err := s.repo.CreateConnection(ctx, createdConnection)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteConnection(ctx context.Context, username string, friendUsername string) error {
	err := s.repo.DeleteConnection(ctx, username, friendUsername)
	if err != nil {
		return err
	}

	return nil
}
