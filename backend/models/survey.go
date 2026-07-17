package models

import "gorm.io/gorm"

type SurveyResponse struct {
	gorm.Model
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	Answers   string `json:"answers"` // We'll store the rest of the answers as a JSON string
}
