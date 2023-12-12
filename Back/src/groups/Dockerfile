FROM golang:1.21 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o groups main.go

FROM alpine:latest  

WORKDIR /app

COPY --from=builder /app /app

CMD ["./groups"]

EXPOSE 8080