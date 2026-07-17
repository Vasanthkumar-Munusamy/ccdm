package main

import (
	"backend/db"
	"backend/models"
	"encoding/json"
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

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// View all surveys
	r.GET("/api/surveys", func(c *gin.Context) {
		var surveys []models.SurveyResponse
		if err := db.DB.Find(&surveys).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch surveys"})
			return
		}
		c.JSON(http.StatusOK, surveys)
	})

	// Survey submission endpoint
	r.POST("/api/survey", func(c *gin.Context) {
		var req struct {
			Name    string                 `json:"name"`
			Email   string                 `json:"email"`
			Phone   string                 `json:"phone"`
			Address string                 `json:"address"`
			Answers map[string]interface{} `json:"answers"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var existing models.SurveyResponse
		if err := db.DB.Where("email = ? OR phone = ?", req.Email, req.Phone).First(&existing).Error; err == nil {
			// Found an existing record
			c.JSON(http.StatusConflict, gin.H{"error": "The user with this email and phone have already taken the servey, thank you!"})
			return
		}

		answersJSON, _ := json.Marshal(req.Answers)

		survey := models.SurveyResponse{
			Name:    req.Name,
			Email:   req.Email,
			Phone:   req.Phone,
			Address: req.Address,
			Answers: string(answersJSON),
		}

		if err := db.DB.Create(&survey).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save survey"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Survey saved successfully", "id": survey.ID})
	})

	// Admin Login endpoint (Simple Hardcoded for now)
	r.POST("/api/admin/login", func(c *gin.Context) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if req.Username == "admin" && req.Password == "admin123" {
			c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": "dummy-admin-token"})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		}
	})

	// Caste Denial QA Endpoints
	r.GET("/api/qa", func(c *gin.Context) {
		var qas []models.CasteDenialQA
		if err := db.DB.Find(&qas).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch QAs"})
			return
		}
		c.JSON(http.StatusOK, qas)
	})

	r.GET("/api/qa/:id", func(c *gin.Context) {
		var qa models.CasteDenialQA
		if err := db.DB.First(&qa, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "QA not found"})
			return
		}
		c.JSON(http.StatusOK, qa)
	})

	r.POST("/api/qa", func(c *gin.Context) {
		var req struct {
			Question string `json:"question"`
			Answer   string `json:"answer"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		qa := models.CasteDenialQA{Question: req.Question, Answer: req.Answer}
		if err := db.DB.Create(&qa).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create QA"})
			return
		}
		c.JSON(http.StatusOK, qa)
	})

	r.PUT("/api/qa/:id", func(c *gin.Context) {
		var qa models.CasteDenialQA
		if err := db.DB.First(&qa, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "QA not found"})
			return
		}
		var req struct {
			Question string `json:"question"`
			Answer   string `json:"answer"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		qa.Question = req.Question
		qa.Answer = req.Answer
		db.DB.Save(&qa)
		c.JSON(http.StatusOK, qa)
	})

	r.DELETE("/api/qa/:id", func(c *gin.Context) {
		if err := db.DB.Delete(&models.CasteDenialQA{}, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete QA"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
	})

	// Start the server
	log.Println("Server is starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
