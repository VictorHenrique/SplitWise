package model

import (
    "time"
)

type User struct {
    Username     string    `json:username"`
    Email        string    `json:email"`
    Password     string    `json:password"`
    Name         string    `json:name"`
    Surname      string    `json:surname"`
    Phone        string    `json:phone"`
    RegisterDate time.Time `json:register_date`
}