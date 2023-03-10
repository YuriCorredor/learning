package models

type Post struct {
	CommonModelFields
	Title       string `json:"title"`
	Description string `json:"description"`
}
