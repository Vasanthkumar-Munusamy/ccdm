package models

import (
	"time"

	"gorm.io/gorm"
)

type QAComment struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	CasteDenialQAID uint           `gorm:"not null;index" json:"qa_id"`
	AuthorName      string         `gorm:"type:varchar(255);not null" json:"author_name"`
	Content         string         `gorm:"type:text;not null" json:"content"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}
