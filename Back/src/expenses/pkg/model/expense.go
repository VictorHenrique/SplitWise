package model

import (
	"time"
)

type Expense struct {
	ID          string    `json:"id"`
	Payee       string    `json:"payee"`
	Amount      float64   `json:"amount"`
	PayDate     time.Time `json:"pay_date"`
	Description string    `json:"description"`
	Title       string    `json:"title"`
	GroupId     string    `json:"group_id"`
}

type UserDue struct {
	Username  string  `json:"username"`
	ExpenseID string  `json:"expense_id"`
	Amount    float64 `json:"amount"`
	IsPayed   bool    `json:"is_payed"`
}
