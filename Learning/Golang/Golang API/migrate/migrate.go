package main

import (
	"github.com/yuricorredor/go-crud/initializers"
	"github.com/yuricorredor/go-crud/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	initializers.DB.AutoMigrate(&models.Post{}, &models.User{})
}
