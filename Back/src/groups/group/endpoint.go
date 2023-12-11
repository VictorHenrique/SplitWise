package group

import (
	"github.com/google/uuid"
	"context"
	"groups/pkg/model"
	"time"

	"github.com/go-kit/kit/endpoint"
)

type registerGroupRequest struct {
	Owner            string    `json:"owner"`
	Name             string    `json:"name"`
	MembersUsernames []string  `json:"members_usernames"`
}

type registerGroupResponse struct {
	ID string `json:"id"` // errors don't JSON-marshal, so we use a string
}

func MakeRegisterGroupEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(registerGroupRequest)

        groupID := uuid.New().String()
		createdGroup := model.Group{
			ID:           groupID,
			Owner:        req.Owner,
			Name:         req.Name,
			CreationDate: time.Now(),
		}

		if err := svc.RegisterGroup(ctx, &createdGroup, req.MembersUsernames); err != nil {
			return registerGroupResponse{""}, err
		}
		return registerGroupResponse{groupID}, nil
	}
}


type addUsersToGroupRequest struct {
	GroupID          string `json:"group_id"`
	MembersUsernames []string  `json:"members_usernames"`
}

type addUsersToGroupResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeAddUsersToGroupEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(addUsersToGroupRequest)

		groupID := req.GroupID
		membersUsernames := req.MembersUsernames

		if err := svc.AddUsersToGroup(ctx, groupID, membersUsernames); err != nil {
			return addUsersToGroupResponse{err.Error()}, err
		}
		return addUsersToGroupResponse{"Success"}, nil
	}
}

type deleteGroupRequest struct {
	ID string `json:"id"`
	Username string `json:"username"`
}

type deleteGroupResponse struct {
	Err string `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeDeleteGroupEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(deleteGroupRequest)
		err := svc.DeleteGroup(ctx, req.ID, req.Username)
		if err != nil {
			return deleteGroupResponse{err.Error()}, err
		}
		return deleteGroupResponse{""}, err
	}
}

type getGroupRequest struct {
	ID string `json:"id"`
}

type getGroupResponse struct {
	Group *model.Group `json:"group"`
	Err   string       `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetGroupEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getGroupRequest)

		group, err := svc.GetGroupByID(ctx, req.ID)
		if err != nil {
			return getGroupResponse{nil, err.Error()}, err
		}
		return getGroupResponse{group, ""}, err
	}
}

type getAllGroupsRequest struct {
	Token string `json:"token"`
}

type getAllGroupsResponse struct {
	Groups []model.Group `json:"groups"`
	Err    string        `json:"err,omitempty"` // errors don't JSON-marshal, so we use a string
}

func MakeGetAllGroupsEndpoint(svc Service) endpoint.Endpoint {
	return func(ctx context.Context, request any) (any, error) {
		req := request.(getAllGroupsRequest)

		groups, err := svc.GetGroupsFromUser(ctx, req.Token)
		if err != nil {
			return getAllGroupsResponse{nil, err.Error()}, err
		}
		return getAllGroupsResponse{groups, ""}, err
	}
}
