package helpers

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func CreateToken(id uint) (string, error) {
	// create the token with the user id and 24 hours expiration time
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["user_id"] = id
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	// return the token
	return token.SignedString([]byte(os.Getenv("SECRET_KEY")))
}

func GetTokenExpirationTime(token string) time.Time {
	// parse the token
	parsedToken, _ := ParseToken(token)

	// get the expiration time
	claims := parsedToken.Claims.(jwt.MapClaims)
	expirationTime := time.Unix(int64(claims["exp"].(float64)), 0)

	return expirationTime
}

func ParseToken(token string) (*jwt.Token, error) {
	// parse the token
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	return parsedToken, err
}
