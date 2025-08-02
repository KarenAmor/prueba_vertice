package main

import (
	"backend-go/config"
	_ "backend-go/docs"
	"backend-go/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @title Gestión de Proyectos y Tareas API (Go)
// @version 1.0
// @description API REST para gestión de proyectos y tareas con autenticación JWT desarrollada en Go

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Ingresa tu token JWT con el prefijo 'Bearer '

func main() {
	// Cargar variables de entorno
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	// Conectar a la base de datos
	config.ConnectDatabase()

	// Configurar Gin en modo release para producción
	gin.SetMode(gin.ReleaseMode)

	// Configurar rutas
	r := routes.SetupRoutes()

	// Configurar proxies confiables (ejemplo: si sabes la IP de tu balanceador de carga)
	// Para desarrollo, puedes confiar en todos los proxies, pero NO en producción.
	// r.SetTrustedProxies([]string{"127.0.0.1"}) // Ejemplo para localhost
	// O para confiar en todos (solo para desarrollo, no recomendado en prod)
	r.SetTrustedProxies(nil) // Confía en todos los proxies (equivalente al comportamiento por defecto de gin.Default())

	// Obtener puerto del entorno o usar 3002 por defecto
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Swagger documentation available at: http://localhost:%s/swagger/index.html", port)
	log.Fatal(r.Run("0.0.0.0:" + port))
}
