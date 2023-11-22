package group

import (
	"time"
	"context"
	"group/pkg/model"
	"github.com/go-kit/kit/endpoint"
)

type registerUserRequest struct {
    Username     string `json:"username"`
	Email        string `json:"email"`
    Password     string `json:"password"`
	Name         string `json:"name"`
	Surname      string `json:"surname"`
	Phone        string `json:"phone"`
	RegisterDate string `json:"register_date"`
}

type registerUserResponse struct {
	Token string `json:"token,omitempty"`
	Err   string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeRegisterUserEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(registerUserRequest)

		createdUser := model.User{
			Username:     req.Username, 
			Email:        req.Email, 
			Password:     req.Password,
			Name:         req.Name, 
			Surname:      req.Surname, 
			Phone:        req.Phone,
			RegisterDate: time.Now(),
		}

		token, err := svc.RegisterUser(ctx, &createdUser)
		if err != nil {
			return registerUserResponse{"", err.Error()}, err
		}
		return registerUserResponse{token, ""}, err
	}
}

type loginUserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginUserResponse struct {
	Token string `json:"token,omitempty"`
	Err   string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeLoginUserEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(loginUserRequest)
		token, err := svc.LoginUser(ctx, req.Username, req.Password)
		if err != nil {
			return loginUserResponse{"", err.Error()}, err
		}
		return loginUserResponse{token, ""}, err
	}
}

type validateTokenRequest struct {
	Token string `json:"token"`
}

type validateTokenResponse struct {
	Username string `json:"username,omitempty"`
	Err      string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeValidateTokenEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(validateTokenRequest)

		username, err := svc.ValidateToken(ctx, req.Token)
		if err != nil {
			return validateTokenResponse{"", err.Error()}, err
		}
		return validateTokenResponse{username, ""}, err
	}
}