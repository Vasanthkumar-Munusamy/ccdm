package main

import (
	"backend/db"
	"backend/middleware"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
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

	// --- Auth Endpoints ---
	r.POST("/api/register", func(c *gin.Context) {
		var req struct {
			Name     string `json:"name" binding:"required"`
			Email    string `json:"email" binding:"required,email"`
			Password string `json:"password" binding:"required,min=6"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		user := models.User{
			Name:     req.Name,
			Email:    req.Email,
			Password: hashedPassword,
		}

		if err := db.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	})

	r.POST("/api/login", func(c *gin.Context) {
		var req struct {
			Email    string `json:"email" binding:"required,email"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user models.User
		if err := db.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		if !utils.CheckPasswordHash(req.Password, user.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		token, err := utils.GenerateToken(user.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": token,
			"user": gin.H{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
			},
		})
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
			// fallback to "file" key for PDFs and other docs
			file, err = c.FormFile("file")
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
				return
			}
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

	// Matrimony Endpoints
	r.GET("/api/matrimony", func(c *gin.Context) {
		var profiles []models.MatrimonialProfile
		if err := db.DB.Order("created_at desc").Find(&profiles).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch matrimonial profiles"})
			return
		}
		c.JSON(http.StatusOK, profiles)
	})

	r.POST("/api/matrimony", middleware.OptionalAuthMiddleware(), func(c *gin.Context) {
		var req struct {
			Name                string `json:"name"`
			Gender              string `json:"gender"`
			Age                 int    `json:"age"`
			Dob                 string `json:"dob"`
			ContactNumber       string `json:"contact_number"`
			Email               string `json:"email"`
			City                string `json:"city"`
			Height              string `json:"height"`
			Weight              string `json:"weight"`
			MotherTongue        string `json:"mother_tongue"`
			Education           string `json:"education"`
			Job                 string `json:"job"`
			Salary              string `json:"salary"`
			FatherName          string `json:"father_name"`
			FatherJob           string `json:"father_job"`
			MotherName          string `json:"mother_name"`
			MotherJob           string `json:"mother_job"`
			Siblings            string `json:"siblings"`
			SiblingsJob         string `json:"siblings_job"`
			ChurchDenomination  string `json:"church_denomination"`
			ChurchName          string `json:"church_name"`
			PastorName          string `json:"pastor_name"`
			PastorContact       string `json:"pastor_contact"`
			MaritalStatus       string `json:"marital_status"`
			Hobbies             string `json:"hobbies"`
			AboutYourself       string `json:"about_yourself"`
			Expectation         string `json:"expectation"`
			PdfUrl              string `json:"pdf_url"`
			ImageUrl            string `json:"image_url"`
			// Legacy mapping
			Location            string `json:"location"`
			Occupation          string `json:"occupation"`
			ContactInfo         string `json:"contact_info"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		profile := models.MatrimonialProfile{
			Name:               req.Name,
			Gender:             req.Gender,
			Age:                req.Age,
			Dob:                req.Dob,
			ContactNumber:      req.ContactNumber,
			Email:              req.Email,
			City:               req.City,
			Height:             req.Height,
			Weight:             req.Weight,
			MotherTongue:       req.MotherTongue,
			Education:          req.Education,
			Job:                req.Job,
			Salary:             req.Salary,
			FatherName:         req.FatherName,
			FatherJob:          req.FatherJob,
			MotherName:         req.MotherName,
			MotherJob:          req.MotherJob,
			Siblings:           req.Siblings,
			SiblingsJob:        req.SiblingsJob,
			ChurchDenomination: req.ChurchDenomination,
			ChurchName:         req.ChurchName,
			PastorName:         req.PastorName,
			PastorContact:      req.PastorContact,
			MaritalStatus:      req.MaritalStatus,
			Hobbies:            req.Hobbies,
			AboutYourself:      req.AboutYourself,
			Expectation:        req.Expectation,
			Location:           req.Location,
			Occupation:         req.Occupation,
			ContactInfo:        req.ContactInfo,
			PdfUrl:             req.PdfUrl,
			ImageUrl:           req.ImageUrl,
		}

		// Attach user ID if logged in
		if userID, exists := c.Get("user_id"); exists {
			id := userID.(uint)
			profile.UserID = &id
		}

		if err := db.DB.Create(&profile).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create matrimonial profile"})
			return
		}

		c.JSON(http.StatusCreated, profile)
	})

	r.PUT("/api/matrimony/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		userID := c.MustGet("user_id").(uint)

		var profile models.MatrimonialProfile
		if err := db.DB.First(&profile, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
			return
		}

		if profile.UserID == nil || *profile.UserID != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to edit this profile"})
			return
		}

		var req struct {
			Name                string `json:"name"`
			Gender              string `json:"gender"`
			Age                 int    `json:"age"`
			Dob                 string `json:"dob"`
			ContactNumber       string `json:"contact_number"`
			Email               string `json:"email"`
			City                string `json:"city"`
			Height              string `json:"height"`
			Weight              string `json:"weight"`
			MotherTongue        string `json:"mother_tongue"`
			Education           string `json:"education"`
			Job                 string `json:"job"`
			Salary              string `json:"salary"`
			FatherName          string `json:"father_name"`
			FatherJob           string `json:"father_job"`
			MotherName          string `json:"mother_name"`
			MotherJob           string `json:"mother_job"`
			Siblings            string `json:"siblings"`
			SiblingsJob         string `json:"siblings_job"`
			ChurchDenomination  string `json:"church_denomination"`
			ChurchName          string `json:"church_name"`
			PastorName          string `json:"pastor_name"`
			PastorContact       string `json:"pastor_contact"`
			MaritalStatus       string `json:"marital_status"`
			Hobbies             string `json:"hobbies"`
			AboutYourself       string `json:"about_yourself"`
			Expectation         string `json:"expectation"`
			PdfUrl              string `json:"pdf_url"`
			ImageUrl            string `json:"image_url"`
			// Legacy mapping
			Location            string `json:"location"`
			Occupation          string `json:"occupation"`
			ContactInfo         string `json:"contact_info"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		profile.Name = req.Name
		profile.Gender = req.Gender
		profile.Age = req.Age
		profile.Dob = req.Dob
		profile.ContactNumber = req.ContactNumber
		profile.Email = req.Email
		profile.City = req.City
		profile.Height = req.Height
		profile.Weight = req.Weight
		profile.MotherTongue = req.MotherTongue
		profile.Education = req.Education
		profile.Job = req.Job
		profile.Salary = req.Salary
		profile.FatherName = req.FatherName
		profile.FatherJob = req.FatherJob
		profile.MotherName = req.MotherName
		profile.MotherJob = req.MotherJob
		profile.Siblings = req.Siblings
		profile.SiblingsJob = req.SiblingsJob
		profile.ChurchDenomination = req.ChurchDenomination
		profile.ChurchName = req.ChurchName
		profile.PastorName = req.PastorName
		profile.PastorContact = req.PastorContact
		profile.MaritalStatus = req.MaritalStatus
		profile.Hobbies = req.Hobbies
		profile.AboutYourself = req.AboutYourself
		profile.Expectation = req.Expectation
		profile.Location = req.Location
		profile.Occupation = req.Occupation
		profile.ContactInfo = req.ContactInfo
		profile.PdfUrl = req.PdfUrl
		profile.ImageUrl = req.ImageUrl

		db.DB.Save(&profile)
		c.JSON(http.StatusOK, profile)
	})

	r.DELETE("/api/matrimony/:id", func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "Bearer dummy-admin-token" {
			// Admin override
		} else {
			// Check standard user token
			var hasAccess bool
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && parts[0] == "Bearer" {
					userID, err := utils.ValidateToken(parts[1])
					if err == nil {
						var profile models.MatrimonialProfile
						if db.DB.First(&profile, c.Param("id")).Error == nil {
							if profile.UserID != nil && *profile.UserID == userID {
								hasAccess = true
							}
						}
					}
				}
			}
			if !hasAccess {
				c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this profile"})
				return
			}
		}

		if err := db.DB.Delete(&models.MatrimonialProfile{}, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete matrimonial profile"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
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
