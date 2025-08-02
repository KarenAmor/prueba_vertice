package controllers

import (
	"backend-go/config"
	"backend-go/models"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type SupabaseAuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         struct {
		ID        string    `json:"id"`
		Email     string    `json:"email"`
		CreatedAt time.Time `json:"created_at"`
	} `json:"user"`
}

// SupabaseLoginResponse es para la respuesta de /token?grant_type=password
type SupabaseLoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         struct {
		ID        string    `json:"id"`
		Email     string    `json:"email"`
		CreatedAt time.Time `json:"created_at"`
	} `json:"user"`
}

// SupabaseSignupResponse es para la respuesta de /signup
type SupabaseSignupResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         struct {
		ID        string    `json:"id"`
		Email     string    `json:"email"`
		CreatedAt time.Time `json:"created_at"`
	} `json:"user"`
}

// Register godoc
// @Summary Registrar nuevo usuario
// @Description Crea una nueva cuenta de usuario en el sistema
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.RegisterRequest true "Datos del usuario"
// @Success 201 {object} models.AuthResponse "Usuario registrado exitosamente"
// @Failure 400 {object} map[string]string "Datos de entrada inválidos"
// @Failure 409 {object} map[string]string "El usuario ya existe"
// @Router /auth/register [post]
func Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convertir email a minúsculas para consistencia
	req.Email = strings.ToLower(req.Email)

	// Usar Supabase Auth para registro
	authData := map[string]string{
		"email":    req.Email,
		"password": req.Password,
	}

	resp, err := config.Supabase.Auth("signup", authData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al conectar con el servicio de autenticación"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("Supabase signup error: Status %d, Body: %s", resp.StatusCode, string(body))
		var errorResp map[string]interface{}
		json.Unmarshal(body, &errorResp)
		c.JSON(resp.StatusCode, gin.H{"error": "Error al registrar usuario"})
		return
	}

	var supabaseSignupResp SupabaseSignupResponse
	if err := json.Unmarshal(body, &supabaseSignupResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar la respuesta de registro"})
		return
	}

	// Insertar el usuario en la tabla users de la base de datos
	userData := map[string]interface{}{
		"id":       supabaseSignupResp.User.ID,
		"email":    supabaseSignupResp.User.Email,
		"password": req.Password,
	}

	userResp, err := config.Supabase.Insert("users", userData)
	if err != nil {
		log.Printf("Error al insertar usuario en tabla users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el usuario en la base de datos"})
		return
	}
	defer userResp.Body.Close()

	if userResp.StatusCode != http.StatusCreated {
		userBody, _ := io.ReadAll(userResp.Body)
		log.Printf("Error al insertar usuario en tabla users: Status %d, Body: %s", userResp.StatusCode, string(userBody))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el usuario en la base de datos"})
		return
	}

	// Generar nuestro propio JWT para mantener compatibilidad
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   supabaseSignupResp.User.ID,
		"email": supabaseSignupResp.User.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar el token"})
		return
	}

	user := models.User{
		ID:        supabaseSignupResp.User.ID,
		Email:     supabaseSignupResp.User.Email,
		CreatedAt: supabaseSignupResp.User.CreatedAt,
	}

	response := models.AuthResponse{
		AccessToken: tokenString,
		User:        user,
	}

	c.JSON(http.StatusCreated, response)
}

// Login godoc
// @Summary Iniciar sesión
// @Description Autentica un usuario y devuelve un token JWT
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body models.LoginRequest true "Credenciales del usuario"
// @Success 200 {object} models.AuthResponse "Login exitoso"
// @Failure 400 {object} map[string]string "Datos de entrada inválidos"
// @Failure 401 {object} map[string]string "Credenciales inválidas"
// @Router /auth/login [post]
func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convertir email a minúsculas para consistencia
	req.Email = strings.ToLower(req.Email)

	// Usar Supabase Auth para login
	authData := map[string]string{
		"email":    req.Email,
		"password": req.Password,
	}

	resp, err := config.Supabase.Auth("token?grant_type=password", authData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al conectar con el servicio de autenticación"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("Supabase login error: Status %d, Body: %s", resp.StatusCode, string(body))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	var supabaseLoginResp SupabaseLoginResponse
	if err := json.Unmarshal(body, &supabaseLoginResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar la respuesta"})
		return
	}

	// Generar nuestro propio JWT para mantener compatibilidad
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   supabaseLoginResp.User.ID,
		"email": supabaseLoginResp.User.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar el token"})
		return
	}

	user := models.User{
		ID:        supabaseLoginResp.User.ID,
		Email:     supabaseLoginResp.User.Email,
		CreatedAt: supabaseLoginResp.User.CreatedAt,
	}

	response := models.AuthResponse{
		AccessToken: tokenString,
		User:        user,
	}

	c.JSON(http.StatusOK, response)
}
