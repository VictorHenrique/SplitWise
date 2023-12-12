package main

import (
	"connections/connection"
	"net/http"
	"os"

	"github.com/go-kit/log"
)

func main() {
	var logger log.Logger
	logger = log.NewLogfmtLogger(os.Stderr)
	logger = log.With(logger, "ts", log.DefaultTimestampUTC, "listen", "8080", "caller", log.DefaultCaller)

	repo := connection.ConnectToDB()

	s := connection.NewService(repo)
	r := connection.NewHttpServer(s, logger)

	logger.Log("msg", "HTTP", "addr", "8080")
	logger.Log("err", http.ListenAndServe(":8080", r))
}
