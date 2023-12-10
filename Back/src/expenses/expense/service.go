package expense

import (
	"context"
	"encoding/json"
	"errors"
	"expenses/pkg/model"
	"net/http"
	"strings"
)

type Service interface {
	GetExpenseByID(ctx context.Context, expenseID string) (*model.Expense, []model.UserDue, error)
	GetExpensesFromGroup(ctx context.Context, id string) ([]model.Expense, []model.UserDue, error)
	GetExpensesFromUser(ctx context.Context, token string) ([]model.Expense, []model.UserDue, error)
	RegisterExpense(ctx context.Context, createdExpense *model.Expense, debtorsUsernames []string) error
	DeleteExpense(ctx context.Context, expenseID string) error
}

type expenseRepository interface {
	GetExpenseByID(ctx context.Context, expenseID string) (*model.Expense, []model.UserDue, error)
	CreateExpense(ctx context.Context, expense *model.Expense, debtorsUsernames []string) error
	DeleteExpense(ctx context.Context, expenseID string) error
	GetAllExpensesFromGroup(ctx context.Context, groupID string) ([]model.Expense, []model.UserDue, error)
	GetAllExpensesFromUser(ctx context.Context, username string) ([]model.Expense, []model.UserDue, error)
	CloseDB() error
}

var (
	ErrDuplicatedExpense = errors.New("duplicate expense")
	ErrInvalidExpense    = errors.New("invalid expense")
	ErrInvalidGroup      = errors.New("invalid group")
	ErrInvalidToken      = errors.New("invalid token")
)

type service struct {
	repo expenseRepository
}

func NewService(expenseRepo expenseRepository) Service {
	return &service{repo: expenseRepo}
}

func (s *service) GetExpenseByID(ctx context.Context, expenseID string) (*model.Expense, []model.UserDue, error) {
	expense, usersDue, err := s.repo.GetExpenseByID(ctx, expenseID)
	if err != nil {
		return nil, nil, err
	}

	return expense, usersDue, err
}

func (s *service) GetExpensesFromGroup(ctx context.Context, groupID string) ([]model.Expense, []model.UserDue, error) {
	expenses, userDues, err := s.repo.GetAllExpensesFromGroup(ctx, groupID)
	if err != nil {
		return nil, nil, err
	}

	return expenses, userDues, nil
}

func (s *service) GetExpensesFromUser(ctx context.Context, token string) ([]model.Expense, []model.UserDue, error) {
	// FIXME: this needs refactoring: Please add this to a middleware that will
	// manage the token requests.
	req, err := http.Post("http://localhost:8081/validate-token", "text/plain", strings.NewReader(token))

	if err != nil {
		return nil, nil, err
	}
	defer req.Body.Close()

	type result struct {
		Username string `json:"username"`
	}

	var res result
	err = json.NewDecoder(req.Body).Decode(&res)
	if err != nil {
		return nil, nil, err
	}
	username := res.Username

	expenses, userDues, err := s.repo.GetAllExpensesFromUser(ctx, username)
	if err != nil {
		return nil, nil, err
	}

	return expenses, userDues, nil
}

func (s *service) RegisterExpense(ctx context.Context, createdExpense *model.Expense, debtorsUsernames []string) error {
	err := s.repo.CreateExpense(ctx, createdExpense, debtorsUsernames)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteExpense(ctx context.Context, expenseID string) error {
	err := s.repo.DeleteExpense(ctx, expenseID)
	if err != nil {
		return err
	}

	return nil
}
