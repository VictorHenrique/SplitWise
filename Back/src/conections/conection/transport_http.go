package conection

import (
	"context"
	"encoding/json"
	"net/http"

	kitlog "github.com/go-kit/log"
	"github.com/go-kit/kit/transport"
	kithttp "github.com/go-kit/kit/transport/http"
	"github.com/gorilla/mux"
)

func NewHttpServer(svc Service, logger kitlog.Logger) *mux.Router {
	options := []kithttp.ServerOption{
		kithttp.ServerErrorHandler(transport.NewLogErrorHandler(logger)),
		kithttp.ServerErrorEncoder(encodeErrorResponse),
		kithttp.ServerFinalizer(newServerFinalizer(logger)),
	}

	registerConectionHandler := kithttp.NewServer(
		MakeRegisterConectionEndpoint(svc),
		decodeRegisterConectionRequest,
		encodeResponse,
		options...,
	)

	deleteConectionHandler := kithttp.NewServer(
		MakeDeleteConectionEndpoint(svc),
		decodeDeleteConectionRequest,
		encodeResponse,
		options...,
	)

	getAllConectionsHandler := kithttp.NewServer(
		MakeGetConectionEndpoint(svc),
		decodeGetConectionRequest,
		encodeResponse,
		options...,
	)

	r := mux.NewRouter()
	r.Methods("POST").Path("/register-conection").Handler(registerConectionHandler)
    r.Methods("DELETE").Path("/delete-conection").Handler(deleteConectionHandler)
	r.Methods("GET").Path("/get-all-conections").Handler(getAllConectionsHandler)

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

func decodeRegisterConectionRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request registerConectionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeDeleteConectionRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request deleteConectionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func decodeGetAllConectionsRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var request getAllConectionsRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		return nil, err
	}
	return request, nil
}

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}
