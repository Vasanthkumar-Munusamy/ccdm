package models

import "time"

type Article struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title"`
	Category  string    `json:"category"`
	Author    string    `json:"author"`
	Date      string    `json:"date"`
	ImageURL  string    `json:"image_url"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
