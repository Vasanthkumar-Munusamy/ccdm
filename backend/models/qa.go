package models

import (
	"time"

	"gorm.io/gorm"
)

type CasteDenialQA struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Question  string         `gorm:"type:text;not null" json:"question"`
	Answer    string         `gorm:"type:text;not null" json:"answer"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
