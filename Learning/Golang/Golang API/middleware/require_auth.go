package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yuricorredor/go-crud/helpers"
)

func RequireAuth(c *fiber.Ctx) error {
	// Get the JWT from the header
	token := c.Get("token")

	// If the token is empty
	if token == "" {
		return fiber.NewError(401, "Unauthorized")
	}

	// If the token is present, verify it and get the userId from it
	parsedToken, err := helpers.ParseToken(token)

	// If there is an error, the token must have expired
	if err != nil {
		return fiber.NewError(401, "Unauthorized")
	}

	claims := parsedToken.Claims.(jwt.MapClaims)
	userId := uint(claims["user_id"].(float64))

	// Pass the userId to the next middleware
	c.Locals("userId", userId)
	return c.Next()
}
