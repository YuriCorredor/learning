package entity

import "errors"

type Order struct {
	ID         string
	Price      float64
	Tax        float64
	FinalPrice float64
}

func (o *Order) Validate() error {
	if o.ID == "" {
		return errors.New("invalid id")
	}
	if o.Price <= 0 {
		return errors.New("invalid price")
	}
	if o.Tax < 0 {
		return errors.New("invalid tax")
	}
	return nil
}

func NewOrder(id string, price float64, tax float64) (*Order, error) {
	order := &Order{
		ID:         id,
		Price:      price,
		Tax:        tax,
		FinalPrice: 0,
	}

	order.CalculateFinalPrice()

	if err := order.Validate(); err != nil {
		return nil, err
	}

	return order, nil
}

func (o *Order) CalculateFinalPrice() {
	o.FinalPrice = o.Price + o.Tax
}
