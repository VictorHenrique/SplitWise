package model

import (
	"time"
)

type Expense struct {
	Index       int       `json:"index"`
	Payee       string    `json:"payee"`
	Amount      int       `json:"amount"`
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
