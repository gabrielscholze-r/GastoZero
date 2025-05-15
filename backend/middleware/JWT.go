package middleware

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey []byte

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func InitJWT() error {
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("failed to load .env: %v", err)
	}

	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtKey) == 0 {
		return fmt.Errorf("JWT_SECRET not found")
	}

	return nil
}
func GenerateJWT(username string) (string, error) {
	expirationTime := time.Now().Add(2 * time.Hour)

	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
func JWTAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid Authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), "email", claims.Username)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
