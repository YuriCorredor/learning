package helpers

import "regexp"

func IsValidPassword(password string) bool {
	regexEx := regexp.MustCompile(`^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$`)
	return !regexEx.MatchString(password)
}
