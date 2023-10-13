package main

import (
	"database/sql"
	"log"
	"net/http"

	"splitwise/auth/internal/controller/auth"
	httphandler "splitwise/auth/internal/handler/http"
	"splitwise/auth/internal/repository/postgres"
)

func main() {
    log.Printf("Starting auth service")

    connStr := "user=pqgotest dbname=pqgotest sslmode=verify-full"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
        panic(err)
    }

    repo := postgres.New(db)
    ctrl := auth.New(repo)
    h := httphandler.New(ctrl)

    http.Handle("/login", http.HandlerFunc(h.GetUser))
    http.Handle("/register", http.HandlerFunc(h.PutUser))

    if err := http.ListenAndServe(":8081", nil); err != nil {
        panic(err)
    }
}
