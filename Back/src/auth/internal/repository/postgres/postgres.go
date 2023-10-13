package postgres

import (
    "context"
    "database/sql"
    "splitwise/auth/pkg/model"
    _ "github.com/lib/pq"
)

type Repository struct {
    db *sql.DB
}

func New(db *sql.DB) *Repository {
    return &Repository{db}
}

func (r *Repository) GetUserByUsername(_ context.Context, username string) (*model.User, error) {
    query := "SELECT id, username, password FROM users WHERE username = $1"
    row := r.db.QueryRow(query, username)

    user := &model.User{}
    err := row.Scan(&user.ID, &user.Username, &user.Password)
    if err != nil {
        return nil, err
    }

    return user, nil
}

func (r *Repository) CreateUser(_ context.Context, user *model.User) error {
    query := "INSERT INTO users (username, password, email, name, surname, phone) VALUES ($1, $2, $3, $4, $5, $6)"
    _, err := r.db.Exec(query, user.Username, user.Password, user.Email, user.Name, user.Surname, user.Phone)
    return err
}
