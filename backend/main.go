package main

import (
	"backend/db"
	"backend/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

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

	// Serve static files from the uploads directory
	r.Static("/uploads", "./uploads")

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

	// Contact form submission endpoint
	r.POST("/api/contact", func(c *gin.Context) {
		var req struct {
			Name    string `json:"name" binding:"required"`
			Email   string `json:"email" binding:"required"`
			Subject string `json:"subject"`
			Message string `json:"message"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload or missing fields"})
			return
		}

		contactMsg := models.ContactMessage{
			Name:    req.Name,
			Email:   req.Email,
			Subject: req.Subject,
			Message: req.Message,
		}

		if err := db.DB.Create(&contactMsg).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save contact message"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Contact message saved successfully", "id": contactMsg.ID})
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

	r.GET("/api/qa/:id/comments", func(c *gin.Context) {
		var comments []models.QAComment
		if err := db.DB.Where("caste_denial_qa_id = ?", c.Param("id")).Order("created_at desc").Find(&comments).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
			return
		}
		c.JSON(http.StatusOK, comments)
	})

	r.POST("/api/qa/:id/comments", func(c *gin.Context) {
		var req struct {
			AuthorName string `json:"author_name"`
			Content    string `json:"content"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		var qa models.CasteDenialQA
		if err := db.DB.First(&qa, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "QA not found"})
			return
		}

		comment := models.QAComment{
			CasteDenialQAID: qa.ID,
			AuthorName:      req.AuthorName,
			Content:         req.Content,
		}

		if err := db.DB.Create(&comment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
			return
		}

		c.JSON(http.StatusCreated, comment)
	})

	r.PUT("/api/qa/:id/comments/:commentId", func(c *gin.Context) {
		var req struct {
			Content string `json:"content"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var comment models.QAComment
		if err := db.DB.Where("id = ? AND caste_denial_qa_id = ?", c.Param("commentId"), c.Param("id")).First(&comment).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
			return
		}

		comment.Content = req.Content
		if err := db.DB.Save(&comment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment"})
			return
		}

		c.JSON(http.StatusOK, comment)
	})

	r.DELETE("/api/qa/:id/comments/:commentId", func(c *gin.Context) {
		if err := db.DB.Where("id = ? AND caste_denial_qa_id = ?", c.Param("commentId"), c.Param("id")).Delete(&models.QAComment{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
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

	// Common Questions Endpoints
	r.GET("/api/common-qa", func(c *gin.Context) {
		var qas []models.CommonQuestion
		if err := db.DB.Find(&qas).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Common QAs"})
			return
		}
		c.JSON(http.StatusOK, qas)
	})

	r.GET("/api/common-qa/:id", func(c *gin.Context) {
		var qa models.CommonQuestion
		if err := db.DB.First(&qa, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Common QA not found"})
			return
		}
		c.JSON(http.StatusOK, qa)
	})

	r.GET("/api/common-qa/:id/comments", func(c *gin.Context) {
		var comments []models.CommonQuestionComment
		if err := db.DB.Where("common_question_id = ?", c.Param("id")).Order("created_at desc").Find(&comments).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
			return
		}
		c.JSON(http.StatusOK, comments)
	})

	r.POST("/api/common-qa/:id/comments", func(c *gin.Context) {
		var req struct {
			AuthorName string `json:"author_name"`
			Content    string `json:"content"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		var qa models.CommonQuestion
		if err := db.DB.First(&qa, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Common QA not found"})
			return
		}

		comment := models.CommonQuestionComment{
			CommonQuestionID: qa.ID,
			AuthorName:       req.AuthorName,
			Content:          req.Content,
		}

		if err := db.DB.Create(&comment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
			return
		}

		c.JSON(http.StatusCreated, comment)
	})

	r.PUT("/api/common-qa/:id/comments/:commentId", func(c *gin.Context) {
		var req struct {
			Content string `json:"content"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var comment models.CommonQuestionComment
		if err := db.DB.Where("id = ? AND common_question_id = ?", c.Param("commentId"), c.Param("id")).First(&comment).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
			return
		}

		comment.Content = req.Content
		if err := db.DB.Save(&comment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment"})
			return
		}

		c.JSON(http.StatusOK, comment)
	})

	r.DELETE("/api/common-qa/:id/comments/:commentId", func(c *gin.Context) {
		if err := db.DB.Where("id = ? AND common_question_id = ?", c.Param("commentId"), c.Param("id")).Delete(&models.CommonQuestionComment{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
	})

	r.POST("/api/common-qa", func(c *gin.Context) {
		var req struct {
			Question string `json:"question"`
			Answer   string `json:"answer"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		qa := models.CommonQuestion{Question: req.Question, Answer: req.Answer}
		if err := db.DB.Create(&qa).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create QA"})
			return
		}
		c.JSON(http.StatusOK, qa)
	})

	r.PUT("/api/common-qa/:id", func(c *gin.Context) {
		var qa models.CommonQuestion
		if err := db.DB.First(&qa, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Common QA not found"})
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

	r.DELETE("/api/common-qa/:id", func(c *gin.Context) {
		if err := db.DB.Delete(&models.CommonQuestion{}, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete QA"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
	})

	// Upload Endpoint
	r.POST("/api/upload", func(c *gin.Context) {
		file, err := c.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}

		// Create uploads directory if it doesn't exist
		if _, err := os.Stat("uploads"); os.IsNotExist(err) {
			os.Mkdir("uploads", 0755)
		}

		// Generate unique filename
		ext := filepath.Ext(file.Filename)
		filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
		dst := filepath.Join("uploads", filename)

		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"url": "/uploads/" + filename})
	})

	// Article Endpoints
	r.GET("/api/articles", func(c *gin.Context) {
		var articles []models.Article
		if err := db.DB.Order("created_at desc").Find(&articles).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
			return
		}
		c.JSON(http.StatusOK, articles)
	})

	r.GET("/api/articles/:id", func(c *gin.Context) {
		var article models.Article
		if err := db.DB.First(&article, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
			return
		}
		c.JSON(http.StatusOK, article)
	})

	r.POST("/api/articles", func(c *gin.Context) {
		var req struct {
			Title    string `json:"title"`
			Category string `json:"category"`
			Author   string `json:"author"`
			Date     string `json:"date"`
			ImageURL string `json:"image_url"`
			Content  string `json:"content"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		article := models.Article{
			Title:    req.Title,
			Category: req.Category,
			Author:   req.Author,
			Date:     req.Date,
			ImageURL: req.ImageURL,
			Content:  req.Content,
		}
		if err := db.DB.Create(&article).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create article"})
			return
		}
		c.JSON(http.StatusOK, article)
	})

	r.PUT("/api/articles/:id", func(c *gin.Context) {
		var article models.Article
		if err := db.DB.First(&article, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
			return
		}
		var req struct {
			Title    string `json:"title"`
			Category string `json:"category"`
			Author   string `json:"author"`
			Date     string `json:"date"`
			ImageURL string `json:"image_url"`
			Content  string `json:"content"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		article.Title = req.Title
		article.Category = req.Category
		article.Author = req.Author
		article.Date = req.Date
		article.ImageURL = req.ImageURL
		article.Content = req.Content
		
		db.DB.Save(&article)
		c.JSON(http.StatusOK, article)
	})

	r.DELETE("/api/articles/:id", func(c *gin.Context) {
		if err := db.DB.Delete(&models.Article{}, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete article"})
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
