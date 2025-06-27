package utils

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type UserInfo struct {
	ID   int    `json:"id"`
	Role string `json:"role"`
}

type Tokens struct {
	AccessToken  string
	RefreshToken string
}

func GenerateJwtKeys(user UserInfo) (Tokens, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return Tokens{}, fmt.Errorf("JWT_SECRET not set")
	}

	accessExpireMin, err := strconv.Atoi(os.Getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
	if err != nil {
		accessExpireMin = 10
	}

	refreshExpireMin, err := strconv.Atoi(os.Getenv("REFRESH_TOKEN_EXPIRE_MINUTES"))
	if err != nil {
		refreshExpireMin = 10080
	}

	accessToken, err := generateToken(user, secret, time.Duration(accessExpireMin)*time.Minute)
	if err != nil {
		return Tokens{}, err
	}

	refreshToken, err := generateToken(user, secret, time.Duration(refreshExpireMin)*time.Minute)
	if err != nil {
		return Tokens{}, err
	}

	return Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func generateToken(user UserInfo, secret string, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"id":   user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(duration).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
