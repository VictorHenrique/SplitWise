package connection

import (
	"connections/pkg/model"
	"context"

	"github.com/go-kit/kit/endpoint"
)

type registerConnectionRequest struct {
	Username       string `json:"username"`
	FriendUsername string `json:"friend_username"`
}

type registerConnectionResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeRegisterConnectionEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(registerConnectionRequest)

		createdConnection := model.Connection{
			Username:       req.Username,
			FriendUsername: req.FriendUsername,
		}

		if err := svc.RegisterConnection(ctx, &createdConnection); err != nil {
			return registerConnectionResponse{err.Error()}, err
		}
		return registerConnectionResponse{"Success"}, nil
	}
}

type deleteConnectionRequest struct {
	Username       string `json:"username"`
	FriendUsername string `json:"friend_username"`
}

type deleteConnectionResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeDeleteConnectionEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(deleteConnectionRequest)
		err := svc.DeleteConnection(ctx, req.Username, req.FriendUsername)
		if err != nil {
			return deleteConnectionResponse{err.Error()}, err
		}
		return deleteConnectionResponse{""}, err
	}
}

type getAllConnectionsRequest struct {
	Token string `json:"token"`
}

type getAllConnectionsResponse struct {
	Connections []string `json:"connections"`
	Err        string            `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllConnectionsEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllConnectionsRequest)

		connections, err := svc.GetConnectionsFromUser(ctx, req.Token)
		if err != nil {
			return getAllConnectionsResponse{nil, err.Error()}, err
		}
		return getAllConnectionsResponse{connections, ""}, err
	}
}
