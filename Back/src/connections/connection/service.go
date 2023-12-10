package connection

import (
	"bytes"
	"connections/pkg/model"
	"context"
	"encoding/json"
	"errors"
	"net/http"
)

type Service interface {
	GetConnectionsFromUser(ctx context.Context, token string) ([]string, error)
	RegisterConnection(ctx context.Context, createdConnection *model.Connection) error
	DeleteConnection(ctx context.Context, token string, friendUsername string) error
}

type connectionRepository interface {
	CreateConnection(ctx context.Context, connection *model.Connection) error
	DeleteConnection(ctx context.Context, username string, friendUsername string) error
	GetAllConnectionsFromUser(ctx context.Context, username string) ([]string, error)
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

func (s *service) GetConnectionsFromUser(ctx context.Context, token string) ([]string, error) {
	// FIXME: this needs refactoring: Please add this to a middleware that will
	// manage the token requests.
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
