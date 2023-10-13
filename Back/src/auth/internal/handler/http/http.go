package http

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"splitwise/auth/internal/controller/auth"
	"splitwise/auth/internal/repository"
	"splitwise/auth/pkg/model"
)

type Handler struct {
    ctrl *auth.Controller
}

func New(ctrl *auth.Controller) *Handler {
    return &Handler{ctrl}
}

func (h *Handler) GetUser(w http.ResponseWriter, req *http.Request) {
    username := req.FormValue("username")
    if username == "" {
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    ctx := req.Context()
    u, err := h.ctrl.Get(ctx, username)
    if err != nil && errors.Is(err, repository.ErrNotFound) {
        w.WriteHeader(http.StatusNotFound)
        return
    } else if err != nil {
        log.Printf("Repository get error: %v\n", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    if err := json.NewEncoder(w).Encode(u); err != nil {
        log.Printf("Response encode error: %v\n", err)
    }
}

func (h *Handler) PutUser(w http.ResponseWriter, req *http.Request) {
    var newUser model.User

    decoder := json.NewDecoder(req.Body)
    if err := decoder.Decode(&newUser); err != nil {
        log.Printf("Request decode error: %v\n", err)
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    ctx := req.Context()
    err := h.ctrl.Put(ctx, &newUser)
    if err != nil {
        log.Printf("Controller Put error: %v\n", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}
