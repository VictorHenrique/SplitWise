package user

import (
    "fmt"
    "log"
    "context"
    "database/sql"
    _ "github.com/lib/pq"
    "auth/pkg/model"
)


const (
    host     = "localhost"
    port     = 5432
    user     = "postgres"
    password = "admin"
    dbname   = "split_wise"
)

type Repository struct {
    db *sql.DB
}

func NewDB(db *sql.DB) *Repository {
    return &Repository{db: db}
}

func (r *Repository) GetUserByUsername(ctx context.Context, username string) (*model.User, error) {
    query := "SELECT username, password FROM user_account WHERE username = $1"
    row := r.db.QueryRow(query, username)

    fmt.Println(row)

    user := &model.User{}
    err := row.Scan(&user.Username, &user.Password)
    if err != nil {
        return nil, err
    }

    return user, nil
}

func (r *Repository) CreateUser(ctx context.Context, user *model.User) error {
    query := "INSERT INTO user_account (username, password, email, name, surname, phone, register_date) VALUES ($1, $2, $3, $4, $5, $6, $7)"
    _, err := r.db.Exec(query, user.Username, user.Password, user.Email, user.Name, user.Surname, user.Phone, user.RegisterDate)

    return err
}


func (r *Repository) GetAllUsers(ctx context.Context) ([]model.User, error) {
    query := "SELECT * FROM user_account;"
    rows, err := r.db.Query(query)
    fmt.Println(rows, err)

    if err != nil {
        return nil, err
    }

    defer rows.Close()

    var users []model.User

    for rows.Next() {
        var user model.User
        if err := rows.Scan(&user.Username, &user.Password, &user.Email, &user.Name, &user.Surname, &user.Phone, &user.RegisterDate); err != nil {
            return users, err
        }
        users = append(users, user)
    }

    if err = rows.Err(); err != nil {
        return users, err
    }

    return users, nil
}


func ConnectToDB() *Repository {
    log.Printf("Connecting to postgres database")

    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
    fmt.Println(psqlInfo)

    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
        panic(err)
    }

    err = db.Ping()
    if err != nil {
        log.Fatal(err)
        panic(err)
    }

    log.Printf("Succesfully connected!")
    
    return NewDB(db)
}

func (r *Repository) CloseDB() error {
    if r.db != nil {
        return r.db.Close()
    }

    return nil
}
