package group

import (
	"context"
	"database/sql"
	"fmt"
	"groups/pkg/model"
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

func (r *Repository) GetGroupByID(ctx context.Context, groupID int) (*model.Group, error) {
	query := "SELECT * FROM users_group WHERE id = $1"
	row := r.db.QueryRow(query, groupID)

	group := &model.Group{}
	err := row.Scan(
		&group.ID,
		&group.Name,
		&group.Owner,
		&group.CreationDate,
	)
	if err != nil {
		return nil, err
	}
	return group, nil
}

func (r *Repository) GetAllGroupsFromUser(ctx context.Context, username string) ([]model.Group, error) {
	query := `
		SELECT id, owner, name, creation_date, amount_users, amount_expenses
		FROM users_group
		WHERE owner = $1
	`
	rows, err := r.db.QueryContext(ctx, query, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []model.Group
	for rows.Next() {
		var group model.Group
		err := rows.Scan(
			&group.ID,
			&group.Owner,
			&group.Name,
			&group.CreationDate,
		)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func (r *Repository) CreateGroup(ctx context.Context, group *model.Group, []string membersUsernames) error {
	query := "INSERT INTO users_group (id, owner, name, creation_date) VALUES ($1, $2, $3, $4)"
	_, err := r.db.Exec(query, group.ID, group.Owner, group.Name, group.CreationDate)

	if err != nil {
		return err
	}

	membersUsernames = append(membersUsernames, group.Owner)

	query = "INSERT INTO user_in_group (username, group_id) VALUES ($1, $2)"
	for _, username := range membersUsernames {
		_, err := r.db.Exec(query, username, group.ID)
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *Repository) DeleteGroup(ctx context.Context, groupID int) error {
	query := "DELETE FROM users_group WHERE id = $1"
	_, err := r.db.Exec(query, groupID)

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
