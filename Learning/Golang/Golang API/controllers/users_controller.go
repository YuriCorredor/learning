package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/yuricorredor/go-crud/helpers"
	"github.com/yuricorredor/go-crud/initializers"
	"github.com/yuricorredor/go-crud/models"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *fiber.Ctx) error {
	// get the email and password from the request body
	type UserType struct {
		Email    string
		Password string
	}
	body := new(UserType)

	helpers.ParseBody(c, body)

	// check if the user already exists
	result := initializers.DB.Where("email = ?", body.Email).First(&models.User{})
	if result.Error == nil {
		return fiber.NewError(400, "User already exists.")
	}

	// check if e-mail is valid
	if !helpers.IsValidEmail(body.Email) {
		return fiber.NewError(400, fmt.Sprintf("Invalid email: \"%s\".", body.Email))
	}

	// check if password is valid
	if !helpers.IsValidPassword(body.Password) {
		return fiber.NewError(400, fmt.Sprintf("Invalid password: \"%s\". Must have at least 8 characters, 1 uppercase, 1 lowercase and one special character.", body.Password))
	}

	// hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		return fiber.NewError(500, "Unable to hash password.")
	}

	// create the user
	user := models.User{Email: body.Email, Password: string(hashedPassword)}
	result = initializers.DB.Create(&user)

	if result.Error != nil {
		return fiber.NewError(500, "Unable to create user.")
	}

	return c.Status(201).JSON("User created successfully.")
}

func SingIn(c *fiber.Ctx) error {
	// get the email and password from the request body
	type UserType struct {
		Email    string
		Password string
	}
	body := new(UserType)

	helpers.ParseBody(c, body)

	// check if the user exists
	user := models.User{}
	result := initializers.DB.First(&user, "email = ?", body.Email)

	if result.Error != nil {
		return fiber.NewError(400, "Unable to login. Check your credentials.")
	}

	// check if the password is correct
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		return fiber.NewError(400, "Unable to login. Check your credentials.")
	}

	// create the token
	token, err := helpers.CreateToken(user.ID)

	if err != nil {
		return fiber.NewError(500, "Unable to create token.")
	}

	// set the token in the response header
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  helpers.GetTokenExpirationTime(token),
		HTTPOnly: true,
		SameSite: "strict",
	})

	// return the response
	return c.Status(200).JSON("Logged in successfully.")
}
