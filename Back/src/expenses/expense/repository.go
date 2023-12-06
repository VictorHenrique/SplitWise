package expense

import (
	"context"
	"database/sql"
	"fmt"
	"expenses/pkg/model"
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

func (r *Repository) GetExpenseByID(ctx context.Context, expenseID int) (*model.Expense, error) {
	query := "SELECT * FROM expenses WHERE id = $1"
	row := r.db.QueryRow(query, expenseID)

	expense := &model.Expense{}
	err := row.Scan(
		&expense.ID,
		&expense.Payee,
		&expense.Amount, 
		&expense.PayDate,
		&expense.Description,
		&expense.Title,
		&expense.GroupId,
	)

	if err != nil {
		return nil, err
	}
	return expense, nil
}

func (r *Repository) GetAllExpensesFromGroup(ctx context.Context, groupID int) ([]model.Expense, error) {
	query := `
		SELECT id, payee, amount, pay_date, description, title, group_id
		FROM expense
		WHERE group_id = $1
	`
	rows, err := r.db.QueryContext(ctx, query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenses []model.Expense
	for rows.Next() {
		var expense model.Expense
		err := row.Scan(
			&expense.ID,
			&expense.Payee,
			&expense.Amount,
			&expense.PayDate,
			&expense.Description,
			&expense.Title,
			&expense.GroupId,
		)
		if err != nil {
			return nil, err
		}
		expenses = append(expenses, expense)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return expenses, nil
}

func (r *Repository) GetAllExpensesFromUser(ctx context.Context, username string) ([]model.Expense, []model.UserDue error) {
	query := `
		SELECT 
			e.id, e.payee, e.amount AS total_amount,
			e.pay_date, e.description, e.title, e.group_id,
			ud.is_payed, ud.amount AS due_amount
		FROM
			expense AS e JOIN user_dues AS ud ON e.id = ud.expense_id
		WHERE
			ud.username = $1
	`
	rows, err := r.db.QueryContext(ctx, query, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()


	var isPayed bool
	var dueAmt  float64

	var expenses []model.Expense
	var userDues []model.UserDues
	for rows.Next() {
		var expense model.Expense
		var userDue model.UserDues

		err := row.Scan(
			&expense.ID,
			&expense.Payee,
			&expense.Amount,
			&expense.PayDate,
			&expense.Description,
			&expense.Title,
			&expense.GroupId,
			&userDue.Amount,
			&userDue.IsPayed,
		)
		userDue.Username = username
		userDue.ExpenseID = expense.ID

		if err != nil {
			return nil, err
		}

		expenses = append(expenses, expense)
		userDues = append(userDues, userDue)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return expenses, userDues, nil
}

func (r *Repository) CreateExpense(ctx context.Context, expense *model.Expense, []string debtorsUsernames) error {
	query := "INSERT INTO expense (id, payee, amount, pay_date, description, title, group_id) VALUES ($1, $2, $3, $4, $5, $6 $7)"
	_, err := r.db.Exec(query, expense.ID, expense.Owner, expense.Name, expense.CreationDate, expense.AmountUsers, expense.AmountExpenses)

	amtDue := expense.AmountUsers / (len(debtorsUsernames) + 1) // + 1 because payee always is debtor

	query = "INSERT INTO user_dues (username, expense_id, amount, is_payed) VALUES ($1, $2, $3, $4)"
	for _, username := range debtorsUsernames {
		_, err := r.db.Exec(query, username, expense.ID, amtDue, false)
		if err != nil {
			return err
		}
	}

	return err
}

func (r *Repository) DeleteExpense(ctx context.Context, expenseID int) error {
	query := "DELETE FROM expense WHERE id = $1"
	_, err := r.db.Exec(query, expenseID)

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
