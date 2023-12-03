package conection

import (
	"conections/pkg/model"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type Service interface {
	GetConectionsFromUser(ctx context.Context, token string) ([]model.Conection, error)
	RegisterConection(ctx context.Context, createdConection *model.Conection) error
	DeleteConection(ctx context.Context, token string, friendUsername string) error
}

type groupRepository interface {
	CreateConection(ctx context.Context, conection *model.Conection) error
	DeleteConection(ctx context.Context, username string, friendUsername string) error
	GetAllConectionsFromUser(ctx context.Context, username string) ([]model.Conection, error)
	CloseDB() error
}

var (
	ErrDuplicatedConection = errors.New("duplicate conection")
	ErrInvalidConection    = errors.New("invalid conection")
	ErrInvalidToken        = errors.New("invalid token")
)

type service struct {
	repo conectionRepository
}

func NewService(conectionRepo conectionRepository) Service {
	return &service{repo: conectionRepo}
}

func (s *service) GetConectionsFromUser(ctx context.Context, token string) ([]model.Group, error) {
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

	conections, err := s.repo.GetAllConectionsFromUser(ctx, username)
	if err != nil {
		return nil, err
	}

	return conections, nil
}

func (s *service) RegisterConection(ctx context.Context, createdConection *model.Conection) error {
	err := s.repo.CreateConection(ctx, createdConection)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteConection(ctx context.Context, username string, friendUsername string) error {
	err := s.repo.DeleteConection(ctx, username, friendUsername)
	if err != nil {
		return err
	}

	return nil
}
