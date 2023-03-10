package models

type User struct {
	CommonModelFields
	Email    string `gorm:"unique" json:"email"`
	Password string
}
