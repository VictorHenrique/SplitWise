package model

type User struct {
    ID string `json:id"`
    Username string `json:username"`
    Password string `json:password"`
    Email string `json:email"`
    Name string `json:name"`
    Surname string `json:surname"`
    Phone string `json:phone"`
}
