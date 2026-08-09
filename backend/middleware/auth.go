package middleware

import (
	"net/http"
	"strings"

	"backend/utils"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware ensures the request has a valid JWT token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		userID, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set the user ID in the context so subsequent handlers can use it
		c.Set("user_id", userID)
		c.Next()
	}
}

// OptionalAuthMiddleware sets the user ID if a valid token is present, but doesn't block if missing
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				userID, err := utils.ValidateToken(parts[1])
				if err == nil {
					c.Set("user_id", userID)
				}
			}
		}
		c.Next()
	}
}
