package database

import (
	"database/sql"
	"testing"

	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
	"github.com/yuricorredor/intensivo/internal/entity"
)

type OrderRepositoryTestSuit struct {
	suite.Suite
	DB *sql.DB
}

func (s *OrderRepositoryTestSuit) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")

	s.Nil(err)

	db.Exec("CREATE TABLE orders (id varchar(255) NOT NULL, price float NOT NULL, tax float NOT NULL, final_price float NOT NULL, PRIMARY KEY (id))")

	s.DB = db
}

func (s *OrderRepositoryTestSuit) TearDownSuite() {
	s.DB.Close()
}

func TestSuit(t *testing.T) {
	suite.Run(t, new(OrderRepositoryTestSuit))
}

func (s *OrderRepositoryTestSuit) TestSavingOrder() {
	order, err := entity.NewOrder("1", 10, 1)

	s.Nil(err)

	repository := NewOrderRepository(s.DB)

	err = repository.Save(order)

	s.Nil(err)
}
