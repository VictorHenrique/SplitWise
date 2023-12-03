package main

import (
	"expenses/expense"
	"net/http"
	"os"
	"github.com/go-kit/log"
)

func main() {
	var logger log.Logger
	logger = log.NewLogfmtLogger(os.Stderr)
	logger = log.With(logger, "ts", log.DefaultTimestampUTC, "listen", "8083", "caller", log.DefaultCaller)

	repo := expense.ConnectToDB()

	s := expense.NewService(repo)
	r := expense.NewHttpServer(s, logger)

	logger.Log("msg", "HTTP", "addr", "8083")
	logger.Log("err", http.ListenAndServe(":8083", r))
}
