package models

import (
	"time"

	"gorm.io/gorm"
)

type CommonModelFields struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `gorm:"primarykey" json:"created_at"`
	UpdatedAt time.Time      `gorm:"primarykey" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
