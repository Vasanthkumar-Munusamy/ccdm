package main

import (
	"backend/db"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database and auto-migrate models
	db.Connect()

	// Initialize Gin router
	r := gin.Default()

	// Health check endpoint
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "Christian Caste Disclaimers Movement API is running",
		})
	})

	// Start the server
	log.Println("Server is starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
