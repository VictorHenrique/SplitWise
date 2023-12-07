package model

import (
	"time"
)

type Group struct {
	ID           string    `json:"id"`
	Owner        string    `json:"owner"`
	Name         string    `json:"name"`
	CreationDate time.Time `json:"creation_date"`
}
