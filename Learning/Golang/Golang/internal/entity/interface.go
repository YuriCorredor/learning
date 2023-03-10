package entity

type OrderRepository interface {
	Save(order *Order) error
	GetTotal() (float64, error)
}
