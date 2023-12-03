package group

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-kit/kit/transport"
	kithttp "github.com/go-kit/kit/transport/http"
	kitlog "github.com/go-kit/log"
	"github.com/gorilla/mux"
)

func NewHttpServer(svc Service, logger kitlog.Logger) *mux.Router {
	options := []kithttp.ServerOption{
		kithttp.ServerErrorHandler(transport.NewLogErrorHandler(logger)),
		kithttp.ServerErrorEncoder(encodeErrorResponse),
		kithttp.ServerFinalizer(newServerFinalizer(logger)),
	}

	registerGroupHandler := kithttp.NewServer(
		MakeRegisterGroupEndpoint(svc),
		decodeRegisterGroupRequest,
		encodeResponse,
		options...,
	)

	deleteGroupHandler := kithttp.NewServer(
		MakeDeleteGroupEndpoint(svc),
		decodeDeleteGroupRequest,
		encodeResponse,
		options...,
	)

	getGroupHandler := kithttp.NewServer(
		MakeGetGroupEndpoint(svc),
		decodeGetGroupRequest,
		encodeResponse,
		options...,
	)

	getAllGroupsHandler := kithttp.NewServer(
		MakeGetAllGroupsEndpoint(svc),
		decodeGetAllGroupsRequest,
		encodeResponse,
		options...,
	)

	r := mux.NewRouter()
	r.Methods("POST").Path("/register-group").Handler(registerGroupHandler)
	r.Methods("DELETE").Path("/delete-group").Handler(deleteGroupHandler)
	r.Methods("GET").Path("/get-group").Handler(getGroupHandler)
	r.Methods("GET").Path("/get-all-groups").Handler(getAllGroupsHandler)

	return r
}

func newServerFinalizer(logger kitlog.Logger) kithttp.ServerFinalizerFunc {
	return func(ctx context.Context, code int, r *http.Request) {
		logger.Log("status", code, "path", r.RequestURI, "method", r.Method)
	}
}

func encodeErrorResponse(_ context.Context, err error, w http.ResponseWriter) {
	if err == nil {
		panic("encodeError with nil error")
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(codeFrom(err))
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error": err.Error(),
	})
}

func codeFrom(err error) int {
	switch err {
	case ErrInvalidToken:
		return http.StatusUnauthorized
	default:
		return http.StatusInternalServerError
	}
}

func decodeRegisterGroupRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request registerGroupRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeDeleteGroupRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request deleteGroupRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeGetGroupRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request getGroupRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeGetAllGroupsRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request getAllGroupsRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}
