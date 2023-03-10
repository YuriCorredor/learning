package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/yuricorredor/go-crud/controllers"
)

func usersRouter(app *fiber.App) {
	usersRouter := app.Group("/users")

	// Users
	usersRouter.Post("/signup", controllers.SignUp)
	usersRouter.Post("/signin", controllers.SingIn)
}
