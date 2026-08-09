package models

import (
	"time"

	"gorm.io/gorm"
)

type MatrimonialProfile struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID      *uint          `json:"user_id,omitempty"` // Made optional
	Name                string         `gorm:"size:255;not null" json:"name"`
	Gender              string         `gorm:"size:50" json:"gender"`
	Age                 int            `json:"age"`
	Dob                 string         `gorm:"size:50" json:"dob"`
	ContactNumber       string         `gorm:"size:255" json:"contact_number"`
	Email               string         `gorm:"size:255" json:"email"`
	City                string         `gorm:"size:255" json:"city"`
	Height              string         `gorm:"size:50" json:"height"`
	Weight              string         `gorm:"size:50" json:"weight"`
	MotherTongue        string         `gorm:"size:255" json:"mother_tongue"`
	Education           string         `gorm:"size:255" json:"education"`
	Job                 string         `gorm:"size:255" json:"job"`
	Salary              string         `gorm:"size:255" json:"salary"`
	FatherName          string         `gorm:"size:255" json:"father_name"`
	FatherJob           string         `gorm:"size:255" json:"father_job"`
	MotherName          string         `gorm:"size:255" json:"mother_name"`
	MotherJob           string         `gorm:"size:255" json:"mother_job"`
	Siblings            string         `gorm:"size:255" json:"siblings"`
	SiblingsJob         string         `gorm:"size:255" json:"siblings_job"`
	ChurchDenomination  string         `gorm:"size:255" json:"church_denomination"`
	ChurchName          string         `gorm:"size:255" json:"church_name"`
	PastorName          string         `gorm:"size:255" json:"pastor_name"`
	PastorContact       string         `gorm:"size:255" json:"pastor_contact"`
	MaritalStatus       string         `gorm:"size:50" json:"marital_status"`
	Hobbies             string         `gorm:"type:text" json:"hobbies"`
	AboutYourself       string         `gorm:"type:text" json:"about_yourself"`
	Expectation         string         `gorm:"type:text" json:"expectation"`
	
	// Legacy fields (kept for backwards compatibility)
	Location            string         `gorm:"size:255" json:"location,omitempty"`
	Occupation          string         `gorm:"size:255" json:"occupation,omitempty"`
	ContactInfo         string         `gorm:"size:255" json:"contact_info,omitempty"`

	PdfUrl              string         `gorm:"size:255" json:"pdf_url"`
	ImageUrl            string         `gorm:"size:255" json:"image_url"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Relationship
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}
