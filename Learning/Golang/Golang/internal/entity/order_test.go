package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewOrder(t *testing.T) {
	_, err := NewOrder("1", 10, 1)

	assert.Nil(t, err)
}

func TestNewOrderInvalidID(t *testing.T) {
	_, err := NewOrder("", 10, 1)

	assert.Equal(t, err.Error(), "invalid id")
}

func TestNewOrderInvalidPrice(t *testing.T) {
	_, err := NewOrder("1", 0, 1)

	assert.Equal(t, err.Error(), "invalid price")
}

func TestNewOrderInvalidTax(t *testing.T) {
	_, err := NewOrder("1", 10, -1)

	assert.Equal(t, err.Error(), "invalid tax")
}

func TestOCalculateFinalPrice(t *testing.T) {
	order, _ := NewOrder("1", 10, 1)

	assert.Equal(t, order.FinalPrice, 11.0)
}
