package conection

import (
	"conections/pkg/model"
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
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

func (r *Repository) GetAllConectionsFromUser(ctx context.Context, username string) ([]model.Group, error) {
	query := `
		SELECT
			CASE
				WHEN username1 = $1 THEN username2
				WHEN username2 = $1 THEN username1
			END
		FROM user_conections
		WHERE username = $1 OR username2 = $1
	`
	rows, err := r.db.QueryContext(ctx, query, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var conections []model.Conection
	for rows.Next() {
		var conection model.Conection
		err := rows.Scan(
			&conection.FriendUsername,
		)
		if err != nil {
			return nil, err
		}

		conection.Username = username
		conections = append(conections, conection)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return conections, nil
}

func (r *Repository) CreateConection(ctx context.Context, conection *model.Conection) error {
	query := "INSERT INTO user_conections (username1, username2) VALUES ($1, $2)"
	_, err := r.db.Exec(query, conection.Username, conection.FriendUsername)

	return err
}

func (r *Repository) DeleteConection(ctx context.Context, username string, friendUsername string) error {
	query := "
		DELETE FROM user_conection
		WHERE (username1 = $1 AND username2 = $2) OR (username2 = $1 AND username1 = $2)
	"
	_, err := r.db.Exec(query, username, friendUsername)

	return err
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
