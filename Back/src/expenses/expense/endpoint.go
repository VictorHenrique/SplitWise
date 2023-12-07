package expense

import (
	"context"
	"expenses/pkg/model"
	"time"

	"github.com/go-kit/kit/endpoint"
)

type registerExpenseRequest struct {
	ID               string    `json:"id"`
	Payee            string    `json:"payee"`
	Amount           int       `json:"amount"`
	PayDate          time.Time `json:"pay_date"`
	Description      string    `json:"description"`
	Title            string    `json:"title"`
	GroupId          string    `json:"group_id"`
	DebtorsUsernames []string  `json:"debtors_usernames"`
}

type registerExpenseResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeRegisterExpenseEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(registerExpenseRequest)

		createdExpense := model.Expense{
			ID:          req.ID,
			Payee:       req.Payee,
			Amount:      req.Amount,
			PayDate:     req.PayDate,
			Description: req.Description,
			Title:       req.Title,
			GroupId:     req.GroupId,
		}

		if err := svc.RegisterExpense(ctx, &createdExpense, req.DebtorsUsernames); err != nil {
			return registerExpenseResponse{err.Error()}, err
		}
		return registerExpenseResponse{""}, nil
	}
}

type deleteExpenseRequest struct {
	ID int `json:"id"`
}

type deleteExpenseResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeDeleteExpenseEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(deleteExpenseRequest)
		err := svc.DeleteExpense(ctx, req.ID)
		if err != nil {
			return deleteExpenseResponse{err.Error()}, err
		}
		return deleteExpenseResponse{""}, err
	}
}

type getExpenseRequest struct {
	ID int `json:"id"`
}

type getExpenseResponse struct {
	Expense *model.Expense `json:"expense"`
	Err     string         `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetExpenseEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getExpenseRequest)

		expense, err := svc.GetExpenseByID(ctx, req.ID)
		if err != nil {
			return getExpenseResponse{nil, err.Error()}, err
		}
		return getExpenseResponse{expense, ""}, err
	}
}

type getAllExpensesFromGroupRequest struct {
	ID int `json:"id"`
}

type getAllExpensesFromGroupResponse struct {
	Expenses []model.Expense  `json:"expenses"`
	UserDues []model.UserDue  `json:"user_due"`
	Err      string           `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllExpensesFromGroupEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllExpensesFromGroupRequest)

		expenses, userDues, err := svc.GetExpensesFromGroup(ctx, req.ID)
		if err != nil {
			return getAllExpensesFromGroupResponse{nil, nil, err.Error()}, err
		}
		return getAllExpensesFromGroupResponse{expenses, userDues, ""}, err
	}
}

type getAllExpensesFromUserRequest struct {
	Token string `json:"token"`
}

type getAllExpensesFromUserResponse struct {
	Expenses []model.Expense `json:"expenses"`
	Err      string          `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllExpensesFromUserEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllExpensesFromUserRequest)

		expenses, err := svc.GetExpensesFromUser(ctx, req.Token)
		if err != nil {
			return getAllExpensesFromUserResponse{nil, err.Error()}, err
		}
		return getAllExpensesFromUserResponse{expenses, ""}, err
	}
}
