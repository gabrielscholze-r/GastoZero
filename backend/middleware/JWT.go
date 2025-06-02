package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey []byte

// Claims define the structure of JWT claims.
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// InitJWT loads the JWT secret from the environment and prepares it for signing tokens.
func InitJWT() error {
	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtKey) == 0 {
		log.Fatal().Msg("JWT_SECRET is missing in the environment")
		return fmt.Errorf("JWT_SECRET not found")
	}

	log.Info().Msg("JWT secret loaded successfully")
	return nil
}

// GenerateJWT generates a signed JWT token with a 2-hour expiration.
func GenerateJWT(username string) (string, error) {
	expirationTime := time.Now().Add(2 * time.Hour)

	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(jwtKey)
	if err != nil {
		log.Error().Err(err).Msg("Failed to sign JWT")
		return "", err
	}

	log.Debug().Msg("JWT generated successfully")
	return signedToken, nil
}

// JWTAuth is a middleware that validates JWT tokens and adds the username to the request context.
func JWTAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			log.Warn().Msg("Missing Authorization header")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Warn().Msg("Malformed Authorization header")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			log.Warn().Err(err).Msg("Invalid or expired JWT")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Token is valid, attach email (username) to context
		log.Debug().Msg("JWT validated successfully")
		ctx := context.WithValue(r.Context(), "email", claims.Username)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
