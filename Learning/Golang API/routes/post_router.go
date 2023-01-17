package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/yuricorredor/go-crud/controllers"
	"github.com/yuricorredor/go-crud/middleware"
)

func postsRouter(app *fiber.App) {
	postsRouter := app.Group("/posts", middleware.RequireAuth)

	// Posts
	postsRouter.Get("/", controllers.GetPosts)
	postsRouter.Get("/", controllers.GetPosts)
	postsRouter.Get("/:id", controllers.GetPost)
	postsRouter.Put("/:id", controllers.UpdatePost)
	postsRouter.Delete("/:id", controllers.DeletePost)
	postsRouter.Post("/", controllers.CreatePost)
}
