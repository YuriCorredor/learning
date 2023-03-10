package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/yuricorredor/go-crud/initializers"
	"github.com/yuricorredor/go-crud/routes"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	port := os.Getenv("PORT")
	app := fiber.New()

	// Middleware to recover from panics anywhere in the chain
	app.Use(recover.New())

	// Routes
	routes.InitiateRouters(app)

	// Start server
	app.Listen(":" + port)
}
