package routes

import (
	"api/constants"
	db "api/db/sqlc"
	"api/services"
	"api/utils"
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func authRoutes(r *mux.Router, s *ServiceHandler) {
	subRouter := r.PathPrefix("/auth").Subrouter()
	subRouter.HandleFunc("/register", s.Register).Methods("POST")
	subRouter.HandleFunc("/login", s.Login).Methods("POST")
	subRouter.HandleFunc("/forgot", s.Forgotpassword).Methods("POST")
	subRouter.HandleFunc("/reset", s.ResetPassword).Methods("POST")
}

// routes
type LoginBody struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func (s *ServiceHandler) Login(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var validator = validator.New()

	var loginBody LoginBody
	err := json.NewDecoder(r.Body).Decode(&loginBody)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	validationErrors := utils.ValidationErrors(validator, loginBody)

	if validationErrors != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Validation failed",
			"errors":  validationErrors,
		})
		return
	}

	// Check if user exists by username
	userExists, err := s.db.queries.GetUserByUsername(ctx, loginBody.Username)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "User account does not exist, please try again", "success": false})
		return
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(userExists.Password), []byte(loginBody.Password))

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Username or password is wrong, please try again", "success": false})
		return
	}

	// Generate JWT keys
	userInfo := utils.UserInfo{
		ID:   int(userExists.ID),
		Role: string(userExists.Role),
	}
	tokens, err := utils.GenerateJwtKeys(userInfo)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not login, please try again", "success": false})
		return
	}

	encryptedRefresh := sha256.Sum256([]byte(tokens.RefreshToken))

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not login, please try again", "success": false})
		return
	}

	// Update Refresh Token in db
	refreshTokenParams := db.UpdateRefreshTokenParams{
		ID: userExists.ID,
		RefreshToken: sql.NullString{
			String: hex.EncodeToString(encryptedRefresh[:]),
			Valid:  true,
		},
	}
	err = s.db.queries.UpdateRefreshToken(ctx, refreshTokenParams)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not login, please try again", "success": false})
		return
	}

	// Set cookies
	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    tokens.AccessToken,
		Expires:  time.Now().Add(15 * time.Minute),
		HttpOnly: true,
		Path:     "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    tokens.RefreshToken,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HttpOnly: true,
		Path:     "/",
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Successfully logged in.",
		"data": map[string]interface{}{
			"role":         userExists.Role,
			"accessToken":  tokens.AccessToken,
			"refreshToken": tokens.RefreshToken,
			"email":        userExists.Email,
			"username":     userExists.Username,
		},
	})
}

type RegisterBody struct {
	Username        string                `json:"username" validate:"required,min=3,max=32"`
	FirstName       string                `json:"firstName" validate:"required,min=1,max=50"`
	LastName        string                `json:"lastName" validate:"required,min=1,max=50"`
	Email           string                `json:"email" validate:"required,email"`
	Company         *string               `json:"company,omitempty"`
	Password        string                `json:"password" validate:"required,min=6"`
	ConfirmPassword *string               `json:"confirmPassword,omitempty" validate:"omitempty,eqfield=Password"`
	IsActive        *bool                 `json:"isActive,omitempty"`
	Role            constants.ServiceEnum `json:"role" validate:"required"`
	ImgPath         *string               `json:"imgPath,omitempty"`
	RefreshToken    *string               `json:"refreshToken,omitempty"`
}

func (s *ServiceHandler) Register(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var validator = validator.New()

	var registerBody RegisterBody
	err := json.NewDecoder(r.Body).Decode(&registerBody)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	validationErrors := utils.ValidationErrors(validator, registerBody)

	if validationErrors != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Validation failed",
			"errors":  validationErrors,
		})
		return
	}

	// Check if user exists by email or username
	userParams := db.CheckUserExistsParams{
		Username: registerBody.Username,
		Email:    registerBody.Email,
	}
	userExists, err := s.db.queries.CheckUserExists(ctx, userParams)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Invalid database operation", "success": false})
		return
	}

	if userExists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "User already exists with same username or email", "success": false})
		return
	}
	// store user

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerBody.Password), bcrypt.DefaultCost)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not hash password, please try again", "success": false})
		return
	}

	userInfo := db.CreateUserParams{
		Username:  registerBody.Username,
		FirstName: registerBody.FirstName,
		LastName:  registerBody.LastName,
		Email:     registerBody.Email,
		Company: func() sql.NullString {
			if registerBody.Company != nil {
				return sql.NullString{String: *registerBody.Company, Valid: true}
			}
			return sql.NullString{Valid: false}
		}(),
		Password: string(hashedPassword),
		IsActive: func() sql.NullBool {
			if registerBody.IsActive != nil {
				return sql.NullBool{Bool: *registerBody.IsActive, Valid: true}
			}
			return sql.NullBool{Valid: false}
		}(),
		Role: db.Role(registerBody.Role),
	}

	userRecord, err := s.db.queries.CreateUser(ctx, userInfo)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not create user record", "success": false})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userRecord)
}

type ForgotPasswordBody struct {
	Email  string `json:"email" validate:"required"`
	Origin string `json:"origin" validate:"required"`
}

func (s *ServiceHandler) Forgotpassword(w http.ResponseWriter, r *http.Request) {
	var forgotPasswordBody ForgotPasswordBody
	err := json.NewDecoder(r.Body).Decode(&forgotPasswordBody)
	var validator = validator.New()

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not process, please try again", "success": false, "message": nil})
		return
	}

	validationErrors := utils.ValidationErrors(validator, forgotPasswordBody)

	if validationErrors != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Validation failed",
			"errors":  validationErrors,
		})
		return
	}
	ctx := context.Background()
	user, err := s.db.queries.GetUserByEmail(ctx, forgotPasswordBody.Email)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]any{"error": nil, "success": true, "message": "Successfully processed"})
		return
	}

	token, _, err := utils.GenerateForgetToken()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not process, please try again", "success": false, "message": nil})
		return
	}

	data := db.UpdateForgotTokenParams{
		ForgotToken: sql.NullString{
			String: token,
			Valid:  true,
		},
		ID: user.ID,
	}

	err = s.db.queries.UpdateForgotToken(ctx, data)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": nil, "success": true, "message": "Successfully sent reset link to email address provided."})
		return
	}

	reset_link := forgotPasswordBody.Origin + "/reset/" + token

	email := services.MailgunService{
		Sender:  user.Email,
		Company: "Alpha Wing",
		Domain:  os.Getenv("MAILGUN_DOMAIN"),
	}
	_, err = email.ForgotPasswordEmail("Password Reset", user.Email, reset_link)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not process, please try again", "success": false})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{"error": nil, "success": true, "message": "Successfully processed"})
}

type ResetPasswordBody struct {
	Password string `json:"password" validate:"required"`
	Token    string `json:"token" validate:"required"`
}

func (s *ServiceHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var resetPasswordBody ResetPasswordBody
	err := json.NewDecoder(r.Body).Decode(&resetPasswordBody)
	var validator = validator.New()

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not process, please try again", "success": false, "message": nil})
		return
	}

	validationErrors := utils.ValidationErrors(validator, resetPasswordBody)

	if validationErrors != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Validation failed",
			"errors":  validationErrors,
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(resetPasswordBody.Password), bcrypt.DefaultCost)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not hash password, please try again", "success": false})
		return
	}
	ctx := context.Background()
	data := db.UpdatePasswordByTokenParams{
		Password: string(hashedPassword),
		ForgotToken: sql.NullString{
			String: resetPasswordBody.Token,
			Valid:  true,
		},
	}

	err = s.db.queries.UpdatePasswordByToken(ctx, data)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"error": "Could not hash password, please try again", "success": false})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{"error": nil, "success": true, "message": "Successfully updated password."})
}
