package models

import (
	"time"

	"gorm.io/gorm"
)

type MatrimonialProfile struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID      uint           `gorm:"not null" json:"user_id"` // Foreign key to User
	Name        string         `gorm:"size:255;not null" json:"name"`
	Age         int            `json:"age"`
	Location    string         `gorm:"size:255" json:"location"`
	Height      string         `gorm:"size:50" json:"height"` // e.g., "5'10\"" or "178 cm"
	Education   string         `gorm:"size:255" json:"education"`
	Expectation string         `gorm:"type:text" json:"expectation"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Relationship
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}
