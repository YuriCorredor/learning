package utils

import "math/rand"

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func RandomUrl(size int) string {
	str := make([]rune, size)

	for i := range str {
		str[i] = letters[rand.Intn(len(letters))]
	}

	return string(str)
}
