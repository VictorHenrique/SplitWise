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
