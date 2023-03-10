package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/yuricorredor/url-shortener/initializers"
	"github.com/yuricorredor/url-shortener/routes"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.InitDatabase()
}

func main() {
	port := os.Getenv("PORT")
	app := fiber.New()

	// Middleware to recover from panics anywhere in the chain
	app.Use(recover.New())

	// Configure Cors
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Routes
	routes.InitiateRouters(app)

	// Start server
	app.Listen(":" + port)
}
