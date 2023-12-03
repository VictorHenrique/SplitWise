package conection

import (
	"conections/pkg/model"
	"context"

	"github.com/go-kit/kit/endpoint"
)

type registerConectionRequest struct {
	Username       string `json:"username"`
	FriendUsername string `json:"friend_username"`
}

type registerConectionResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeRegisterConectionEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(registerConectionRequest)

		createdConection := model.Conection{
			Username:       req.Username,
			FriendUsername: req.FriendUsername,
		}

		if err := svc.RegisterConection(ctx, &createdConection); err != nil {
			return registerConectionResponse{err.Error()}, err
		}
		return registerConectionResponse{""}, nil
	}
}

type deleteConectionRequest struct {
	Username       string `json:"username"`
	FriendUsername string `json:"friend_username"`
}

type deleteConectionResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeDeleteConectionEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(deleteConectionRequest)
		err := svc.DeleteConection(ctx, req.Username, req.FriendUsername)
		if err != nil {
			return deleteConectionResponse{err.Error()}, err
		}
		return deleteConectionResponse{""}, err
	}
}

type getAllConectionsRequest struct {
	Token string `json:"token"`
}

type getAllConectionsResponse struct {
	Conections []model.Conection `json:"conections"`
	Err        string            `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllConectionsEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllConectionsRequest)

		conections, err := svc.GetConectionsFromUser(ctx, req.Token)
		if err != nil {
			return getAllConectionsResponse{nil, err.Error()}, err
		}
		return getAllConectionsResponse{conections, ""}, err
	}
}
