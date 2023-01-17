package routes

import "github.com/gofiber/fiber/v2"

func InitiateRouters(app *fiber.App) {
	postsRouter(app)
	usersRouter(app)
}
