package controllers

import (
	"fmt"
	"strconv"

	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/yuricorredor/url-shortener/model"
	"github.com/yuricorredor/url-shortener/utils"
)

var validate = validator.New()

func ValidateStruct(slug *model.Slug) []string {
	var errors []string
	err := validate.Struct(slug)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			errorMessage := fmt.Sprintf("Field validation for '%s' failed on the '%s' tag (%s).", err.Field(), err.Tag(), err.Param())
			errors = append(errors, errorMessage)
		}
	}
	return errors
}

func GetAllSlugs(ctx *fiber.Ctx) error {
	slugs, err := model.GetAllSlugs()

	if err != nil {
		return fiber.NewError(500, "Unable to get Slugs.")
	}

	return ctx.JSON(slugs)
}

func GetSlug(ctx *fiber.Ctx) error {
	id, err := strconv.ParseUint(ctx.Params("id"), 10, 64)

	if err != nil {
		return fiber.NewError(400, "Unable to get id. Please send a positive integer as the id.")
	}

	slug, err := model.GetSlugBySlug(id)

	if err != nil {
		return fiber.NewError(404, "Unable to find Slug.")
	}

	return ctx.JSON(slug)
}

func CreateSlug(ctx *fiber.Ctx) error {
	var slug model.Slug

	if err := ctx.BodyParser(&slug); err != nil {
		return fiber.NewError(400, "Unable to parse body. "+err.Error())
	}

	if slug.Random {
		slug.Slug = utils.RandomUrl(8)
	}

	if err := ValidateStruct(&slug); err != nil {
		return ctx.Status(400).JSON(err)
	}

	if err := model.CreateSlug(&slug); err != nil {
		return fiber.NewError(500, "Unable to create Slug. "+err.Error())
	}

	return ctx.JSON(slug)
}

func UpdateSlug(ctx *fiber.Ctx) error {
	id, err := strconv.ParseUint(ctx.Params("id"), 10, 64)

	if err != nil {
		return fiber.NewError(400, "Unable to get id. Please send a positive integer as the id.")
	}

	var slug model.Slug

	if err := ctx.BodyParser(&slug); err != nil {
		return fiber.NewError(400, "Unable to parse body.")
	}

	slug.ID = id

	if err := model.UpdateSlug(&slug); err != nil {
		return fiber.NewError(500, "Unable to update Slug.")
	}

	return ctx.JSON(slug)
}

func DeleteSlug(ctx *fiber.Ctx) error {
	id, err := strconv.ParseUint(ctx.Params("id"), 10, 64)

	if err != nil {
		return fiber.NewError(400, "Unable to get id. Please send a positive integer as the id.")
	}

	if err := model.DeleteSlug(id); err != nil {
		return fiber.NewError(500, "Unable to delete Slug.")
	}

	return ctx.SendStatus(200)
}

func RedirectSlug(ctx *fiber.Ctx) error {
	slugUrl := ctx.Params("slug")

	slug, err := model.GetUrlBySlug(slugUrl)

	if err != nil {
		return fiber.NewError(404, "Unable to find Slug.")
	}

	slug.Clicks += 1
	if err := model.UpdateSlug(&slug); err != nil {
		return fiber.NewError(500, "Unable to update Slug.")
	}

	return ctx.Redirect(slug.Redirect, 301)
}
