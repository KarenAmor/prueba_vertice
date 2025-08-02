package routes

import (
	"backend-go/controllers"
	"backend-go/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Configurar CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Ruta de Swagger
	url := ginSwagger.URL("http://localhost:3002/swagger/doc.json") // Forzamos la URL del JSON
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	// Rutas públicas
	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}

	// Rutas protegidas
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Rutas de proyectos
		projects := protected.Group("/projects")
		{
			projects.GET("", controllers.GetProjects)
			projects.POST("", controllers.CreateProject)
			projects.GET("/:id", controllers.GetProject)
			projects.PATCH("/:id", controllers.UpdateProject)
			projects.DELETE("/:id", controllers.DeleteProject)
		}

		// Rutas de tareas
		tasks := protected.Group("/tasks")
		{
			tasks.GET("", controllers.GetTasksByProject)
			tasks.POST("", controllers.CreateTask)
			tasks.GET("/:id", controllers.GetTask)
			tasks.PATCH("/:id", controllers.UpdateTask)
			tasks.DELETE("/:id", controllers.DeleteTask)
		}
	}

	return r
}
