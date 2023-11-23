package main

import (
	"groups/group"
	"net/http"
	"os"
	"github.com/go-kit/log"
)

func main() {
	var logger log.Logger
	logger = log.NewLogfmtLogger(os.Stderr)
	logger = log.With(logger, "ts", log.DefaultTimestampUTC, "listen", "8082", "caller", log.DefaultCaller)

	repo := group.ConnectToDB()

	s := group.NewService(repo)
	r := group.NewHttpServer(s, logger)

	logger.Log("msg", "HTTP", "addr", "8082")
	logger.Log("err", http.ListenAndServe(":8082", r))
}
