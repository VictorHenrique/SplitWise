package connection

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

	registerConnectionHandler := kithttp.NewServer(
		MakeRegisterConnectionEndpoint(svc),
		decodeRegisterConnectionRequest,
		encodeResponse,
		options...,
	)

	deleteConnectionHandler := kithttp.NewServer(
		MakeDeleteConnectionEndpoint(svc),
		decodeDeleteConnectionRequest,
		encodeResponse,
		options...,
	)

	getAllConnectionsHandler := kithttp.NewServer(
		MakeGetConnectionEndpoint(svc),
		decodeGetConnectionRequest,
		encodeResponse,
		options...,
	)

	r := mux.NewRouter()
	r.Methods("POST").Path("/register-connection").Handler(registerConnectionHandler)
	r.Methods("DELETE").Path("/delete-connection").Handler(deleteConnectionHandler)
	r.Methods("GET").Path("/get-all-connections").Handler(getAllConnectionsHandler)

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

func decodeRegisterConnectionRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request registerConnectionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeDeleteConnectionRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request deleteConnectionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeGetAllConnectionsRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request getAllConnectionsRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}
