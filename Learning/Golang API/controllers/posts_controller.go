package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/yuricorredor/go-crud/helpers"
	"github.com/yuricorredor/go-crud/initializers"
	"github.com/yuricorredor/go-crud/models"
)

func CreatePost(c *fiber.Ctx) error {
	type BodyType struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	body := new(BodyType)

	helpers.ParseBody(c, body)

	post := models.Post{Title: body.Title, Description: body.Description}
	result := initializers.DB.Create(&post)

	if result.Error != nil {
		return fiber.NewError(404, "Unable to create post in our Database.")
	}

	return c.JSON(fiber.Map{"post": post})
}

func GetPost(c *fiber.Ctx) error {
	post := models.Post{}
	id := c.Params("id")

	result := initializers.DB.First(&post, id)

	if result.Error != nil {
		return fiber.NewError(404, "Unable to find post in our Database.")
	}

	return c.JSON(fiber.Map{"post": post})
}

func GetPosts(c *fiber.Ctx) error {
	var posts []models.Post
	result := initializers.DB.Find(&posts)

	if result.Error != nil {
		return fiber.NewError(404, "Unable to find posts in our Database.")
	}

	return c.JSON(fiber.Map{"posts": posts})
}

func UpdatePost(c *fiber.Ctx) error {
	id := c.Params("id")
	type BodyType struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	body := new(BodyType)

	helpers.ParseBody(c, body)

	post := models.Post{}
	getResult := initializers.DB.First(&post, id)

	if getResult.Error != nil {
		return fiber.NewError(404, "Unable to find post in our Database.")
	}

	updateResult := initializers.DB.Model(&post).Updates(models.Post{
		Title:       body.Title,
		Description: body.Description,
	})

	if updateResult.Error != nil {
		return fiber.NewError(404, "Unable to update post in our Database.")
	}

	return c.JSON(fiber.Map{"post": post})
}

func DeletePost(c *fiber.Ctx) error {
	id := c.Params("id")
	post := models.Post{}
	result := initializers.DB.Delete(&post, id)

	if result.Error != nil {
		return fiber.NewError(404, "Unable to delete post from our Database.")
	}

	return c.SendString("Post deleted successfully.")
}
