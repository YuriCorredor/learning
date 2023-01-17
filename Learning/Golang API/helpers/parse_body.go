package helpers

import (
	"github.com/gofiber/fiber/v2"
)

func ParseBody(c *fiber.Ctx, body interface{}) error {
	if err := c.BodyParser(body); err != nil {
		return fiber.NewError(400, "Unable to parse body.")
	}
	return nil
}
