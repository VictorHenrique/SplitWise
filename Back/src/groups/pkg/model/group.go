package model

import (
    "time"
)

type Group struct {
    ID             int       `json:"id"`
    Owner          string    `json:"owner"`
    Name           string    `json:"name"`
    CreationDate   time.Time `json:"creation_date"`
    AmountUsers    int       `json:"amount_users"`
    AmountExpenses int       `json:"amount_expenses"`
}