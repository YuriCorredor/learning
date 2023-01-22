package main

import (
	"github.com/yuricorredor/url-shortener/initializers"
	"github.com/yuricorredor/url-shortener/model"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.InitDatabase()
}

func main() {
	err := initializers.DB.AutoMigrate(&model.Slug{})

	if err != nil {
		panic("Failed to migrate database!")
	} else {
		println("Database migrated successfully!")
	}
}
