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
	host     = "db"
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

func (r *Repository) GetGroupByID(ctx context.Context, groupID string) (*model.Group, error) {
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
	query := "SELECT g.id, g.owner, g.name, g.creation_date FROM user_in_group ug JOIN users_group g ON g.id = ug.group_id WHERE username = $1"
	rows, err := r.db.QueryContext(ctx, query, username)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var groups []model.Group
	for rows.Next() {
		var group model.Group
		if err := rows.Scan(
			&group.ID,
			&group.Owner,
			&group.Name,
			&group.CreationDate,
		); err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	if len(groups) == 0 {
		return nil, nil
	}

    return groups, nil
}

func (r *Repository) CreateGroup(ctx context.Context, group *model.Group, membersUsernames []string) error {
	query := "INSERT INTO users_group (id, owner, name, creation_date) VALUES ($1, $2, $3, $4)"
	_, err := r.db.Exec(query, group.ID, group.Owner, group.Name, group.CreationDate)

	if err != nil {
		return err
	}

	membersUsernames = append(membersUsernames, group.Owner)

	err = r.AddUsersToGroup(ctx, group.ID, membersUsernames)

	return err
}

func (r *Repository) DeleteGroup(ctx context.Context, groupID string, username string) error {
	query := "DELETE FROM users_group WHERE id = $1 AND owner = $2"
	_, err := r.db.Exec(query, groupID, username)

	return err
}

func (r *Repository) AddUsersToGroup(ctx context.Context, groupID string, membersUsernames []string) error {
	query := "SELECT id FROM users_group WHERE id = $1"
	rows, err := r.db.QueryContext(ctx, query, groupID)
	if err != nil {
		return nil
	}

	if !rows.Next() {
		return fmt.Errorf("No group with id %s", groupID)
	}

	query = "INSERT INTO user_in_group (username, group_id) VALUES ($1, $2)"
	for _, username := range membersUsernames {
		_, err := r.db.Exec(query, username, groupID)
		if err != nil {
			return err
		}
	}

	return nil
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
