package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/yuricorredor/url-shortener/controllers"
)

func slugRoutes(app *fiber.App) {
	slugRouter := app.Group("/slugs")

	slugRouter.Get("/", controllers.GetAllSlugs)
	slugRouter.Get("/:id", controllers.GetSlug)
	slugRouter.Post("", controllers.CreateSlug)
	slugRouter.Patch("/:id", controllers.UpdateSlug)
	slugRouter.Delete("/:id", controllers.DeleteSlug)
	slugRouter.Get("/r/:slug", controllers.RedirectSlug)
}
