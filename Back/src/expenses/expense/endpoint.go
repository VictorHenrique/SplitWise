package expense

import (
	"github.com/google/uuid"
	"context"
	"expenses/pkg/model"
	"time"

	"github.com/go-kit/kit/endpoint"
)

type registerExpenseRequest struct {
	Payee            string    `json:"payee"`
	Amount           float64   `json:"amount"`
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
			ID:          uuid.New().String(),
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
		return registerExpenseResponse{"Sucess"}, nil
	}
}

type deleteExpenseRequest struct {
	ID string `json:"id"`
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
	ID string `json:"id"`
}

type getExpenseResponse struct {
	Expense   *model.Expense  `json:"expense"`
	UsersDue []model.UserDue `json:"user_dues"`
	Err        string         `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetExpenseEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getExpenseRequest)

		expense, usersDue, err := svc.GetExpenseByID(ctx, req.ID)
		if err != nil {
			return getExpenseResponse{nil, nil, err.Error()}, err
		}
		return getExpenseResponse{expense, usersDue, ""}, err
	}
}

type getAllExpensesFromGroupRequest struct {
	ID string `json:"id"`
}

type getAllExpensesFromGroupResponse struct {
	Expenses []model.Expense  `json:"expenses"`
	Err      string           `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllExpensesFromGroupEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllExpensesFromGroupRequest)

		expenses, err := svc.GetExpensesFromGroup(ctx, req.ID)
		if err != nil {
			return getAllExpensesFromGroupResponse{nil, err.Error()}, err
		}
		return getAllExpensesFromGroupResponse{expenses, ""}, err
	}
}

type getAllExpensesFromUserRequest struct {
	Token string `json:"token"`
}

type getAllExpensesFromUserResponse struct {
	Expenses []model.Expense `json:"expenses"`
	UserDues []model.UserDue  `json:"user_due"`
	Err      string          `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllExpensesFromUserEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllExpensesFromUserRequest)

		expenses, usersDue, err := svc.GetExpensesFromUser(ctx, req.Token)
		if err != nil {
			return getAllExpensesFromUserResponse{nil, nil, err.Error()}, err
		}
		return getAllExpensesFromUserResponse{expenses, usersDue, ""}, err
	}
}
