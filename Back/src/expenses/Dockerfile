FROM golang:1.21 AS builder

WORKDIR /app

ENV GOPROXY=direct
COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o expenses main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app /app

CMD ["./expenses"]

EXPOSE 8080
