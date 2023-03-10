package database

import (
	"database/sql"

	"github.com/yuricorredor/intensivo/internal/entity"
)

type OrderRepository struct {
	DB *sql.DB
}

func NewOrderRepository(db *sql.DB) *OrderRepository {
	return &OrderRepository{
		DB: db,
	}
}

func (r *OrderRepository) Save(order *entity.Order) error {
	_, err := r.DB.Exec("INSERT INTO orders (id, price, tax, final_price) VALUES (?, ?, ?, ?)", order.ID, order.Price, order.Tax, order.FinalPrice)

	if err != nil {
		return err
	}

	return nil
}

func (r *OrderRepository) GetTotal() (int, error) {
	var total int

	err := r.DB.QueryRow("SELECT COUNT(*) FROM orders").Scan(&total)

	if err != nil {
		return 0, err
	}

	return total, nil
}
