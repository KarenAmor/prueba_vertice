package controllers

import (
	"backend-go/config"
	"backend-go/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

// GetProjects godoc
// @Summary Listar proyectos del usuario
// @Description Obtiene todos los proyectos del usuario autenticado
// @Tags projects
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Project "Lista de proyectos obtenida exitosamente"
// @Failure 401 {object} map[string]string "Token JWT requerido"
// @Failure 500 {object} map[string]string "Error interno del servidor"
// @Router /projects [get]
func GetProjects(c *gin.Context) {
	userID := c.GetString("userID")

	query := fmt.Sprintf("user_id=eq.%s&order=created_at.desc", userID)
	resp, err := config.Supabase.Select("projects", query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener los proyectos"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al obtener los proyectos"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(body, &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar los proyectos"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// GetProject godoc
// @Summary Obtener proyecto por ID
// @Description Obtiene un proyecto específico del usuario autenticado
// @Tags projects
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "ID del proyecto"
// @Success 200 {object} models.Project "Proyecto obtenido exitosamente"
// @Failure 401 {object} map[string]string "Token JWT requerido"
// @Failure 404 {object} map[string]string "Proyecto no encontrado"
// @Router /projects/{id} [get]
func GetProject(c *gin.Context) {
	userID := c.GetString("userID")
	projectID := c.Param("id")

	query := fmt.Sprintf("id=eq.%s&user_id=eq.%s", projectID, userID)
	resp, err := config.Supabase.Select("projects", query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener el proyecto"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al obtener el proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(body, &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar el proyecto"})
		return
	}

	if len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proyecto no encontrado"})
		return
	}

	c.JSON(http.StatusOK, projects[0])
}

// CreateProject godoc
// @Summary Crear nuevo proyecto
// @Description Crea un nuevo proyecto para el usuario autenticado
// @Tags projects
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param project body models.CreateProjectRequest true "Datos del proyecto"
// @Success 201 {object} models.Project "Proyecto creado exitosamente"
// @Failure 400 {object} map[string]string "Datos de entrada inválidos"
// @Failure 401 {object} map[string]string "Token JWT requerido"
// @Router /projects [post]
func CreateProject(c *gin.Context) {
	userID := c.GetString("userID")
	var req models.CreateProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectData := map[string]interface{}{
		"user_id":     userID,
		"name":        req.Name,
		"description": req.Description,
	}

	resp, err := config.Supabase.Insert("projects", projectData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el proyecto"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusCreated {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al crear el proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(body, &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar el proyecto creado"})
		return
	}

	if len(projects) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear el proyecto"})
		return
	}

	c.JSON(http.StatusCreated, projects[0])
}

func UpdateProject(c *gin.Context) {
	userID := c.GetString("userID")
	projectID := c.Param("id")
	var req models.UpdateProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateData := make(map[string]interface{})
	if req.Name != nil {
		updateData["name"] = *req.Name
	}
	if req.Description != nil {
		updateData["description"] = *req.Description
	}

	query := fmt.Sprintf("id=eq.%s&user_id=eq.%s", projectID, userID)
	resp, err := config.Supabase.Update("projects", updateData, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el proyecto"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al actualizar el proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(body, &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar el proyecto actualizado"})
		return
	}

	if len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proyecto no encontrado"})
		return
	}

	c.JSON(http.StatusOK, projects[0])
}

func DeleteProject(c *gin.Context) {
	userID := c.GetString("userID")
	projectID := c.Param("id")

	// Primero eliminar las tareas asociadas
	taskQuery := fmt.Sprintf("project_id=eq.%s", url.QueryEscape(projectID))
	_, err := config.Supabase.Delete("tasks", taskQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar las tareas del proyecto"})
		return
	}

	// Luego eliminar el proyecto
	projectQuery := fmt.Sprintf("id=eq.%s&user_id=eq.%s", projectID, userID)
	resp, err := config.Supabase.Delete("projects", projectQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el proyecto"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al eliminar el proyecto"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Proyecto eliminado correctamente"})
}
