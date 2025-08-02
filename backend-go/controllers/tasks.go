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

func GetTasksByProject(c *gin.Context) {
	userID := c.GetString("userID")
	projectID := c.Query("project_id")

	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "project_id es requerido"})
		return
	}

	// Verificar que el proyecto pertenece al usuario
	projectQuery := fmt.Sprintf("id=eq.%s&user_id=eq.%s", projectID, userID)
	projectResp, err := config.Supabase.Select("projects", projectQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al verificar el proyecto"})
		return
	}
	defer projectResp.Body.Close()

	projectBody, err := io.ReadAll(projectResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta del proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(projectBody, &projects); err != nil || len(projects) == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes acceso a este proyecto"})
		return
	}

	// Obtener las tareas del proyecto
	taskQuery := fmt.Sprintf("project_id=eq.%s&order=created_at.desc", projectID)
	resp, err := config.Supabase.Select("tasks", taskQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las tareas"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al obtener las tareas"})
		return
	}

	var tasks []models.Task
	if err := json.Unmarshal(body, &tasks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar las tareas"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func GetTask(c *gin.Context) {
	userID := c.GetString("userID")
	taskID := c.Param("id")

	// Obtener la tarea con verificación de pertenencia al usuario
	query := fmt.Sprintf("id=eq.%s", taskID)
	resp, err := config.Supabase.Select("tasks", query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la tarea"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al obtener la tarea"})
		return
	}

	var tasks []models.Task
	if err := json.Unmarshal(body, &tasks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar la tarea"})
		return
	}

	if len(tasks) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	task := tasks[0]

	// Verificar que el proyecto de la tarea pertenece al usuario
	projectQuery := fmt.Sprintf("id=eq.%s&user_id=eq.%s", task.ProjectID, userID)
	projectResp, err := config.Supabase.Select("projects", projectQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al verificar el proyecto"})
		return
	}
	defer projectResp.Body.Close()

	projectBody, err := io.ReadAll(projectResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta del proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(projectBody, &projects); err != nil || len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func CreateTask(c *gin.Context) {
	userID := c.GetString("userID")
	var req models.CreateTaskRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar que el proyecto pertenece al usuario
	projectQuery := fmt.Sprintf("id=eq.%s&user_id=eq.%s", req.ProjectID, userID)
	projectResp, err := config.Supabase.Select("projects", projectQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al verificar el proyecto"})
		return
	}
	defer projectResp.Body.Close()

	projectBody, err := io.ReadAll(projectResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta del proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(projectBody, &projects); err != nil || len(projects) == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes acceso a este proyecto"})
		return
	}

	// Establecer estado por defecto si no se proporciona
	if req.Status == "" {
		req.Status = "pending"
	}

	taskData := map[string]interface{}{
		"project_id":  req.ProjectID,
		"title":       req.Title,
		"description": req.Description,
		"status":      req.Status,
	}

	resp, err := config.Supabase.Insert("tasks", taskData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la tarea"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusCreated {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al crear la tarea"})
		return
	}

	var tasks []models.Task
	if err := json.Unmarshal(body, &tasks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar la tarea creada"})
		return
	}

	if len(tasks) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear la tarea"})
		return
	}

	c.JSON(http.StatusCreated, tasks[0])
}

func UpdateTask(c *gin.Context) {
	userID := c.GetString("userID")
	taskID := c.Param("id")
	var req models.UpdateTaskRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar que la tarea pertenece al usuario (a través del proyecto)
	taskQuery := fmt.Sprintf("id=eq.%s", taskID)
	taskResp, err := config.Supabase.Select("tasks", taskQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la tarea"})
		return
	}
	defer taskResp.Body.Close()

	taskBody, err := io.ReadAll(taskResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta de la tarea"})
		return
	}

	var tasks []models.Task
	if err := json.Unmarshal(taskBody, &tasks); err != nil || len(tasks) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	task := tasks[0]

	// Verificar que el proyecto pertenece al usuario
	projectQuery := fmt.Sprintf("id=eq.%s&user_id=eq.%s", task.ProjectID, userID)
	projectResp, err := config.Supabase.Select("projects", projectQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al verificar el proyecto"})
		return
	}
	defer projectResp.Body.Close()

	projectBody, err := io.ReadAll(projectResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta del proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(projectBody, &projects); err != nil || len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	// Actualizar la tarea
	updateData := make(map[string]interface{})
	if req.Title != nil {
		updateData["title"] = *req.Title
	}
	if req.Description != nil {
		updateData["description"] = *req.Description
	}
	if req.Status != nil {
		updateData["status"] = *req.Status
	}

	query := fmt.Sprintf("id=eq.%s", taskID)
	resp, err := config.Supabase.Update("tasks", updateData, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la tarea"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al actualizar la tarea"})
		return
	}

	var updatedTasks []models.Task
	if err := json.Unmarshal(body, &updatedTasks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar la tarea actualizada"})
		return
	}

	if len(updatedTasks) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	c.JSON(http.StatusOK, updatedTasks[0])
}

func DeleteTask(c *gin.Context) {
	userID := c.GetString("userID")
	taskID := c.Param("id")

	// Verificar que la tarea pertenece al usuario (a través del proyecto)
	taskQuery := fmt.Sprintf("id=eq.%s", taskID)
	taskResp, err := config.Supabase.Select("tasks", taskQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la tarea"})
		return
	}
	defer taskResp.Body.Close()

	taskBody, err := io.ReadAll(taskResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta de la tarea"})
		return
	}

	var tasks []models.Task
	if err := json.Unmarshal(taskBody, &tasks); err != nil || len(tasks) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	task := tasks[0]

	// Verificar que el proyecto pertenece al usuario
	projectQuery := fmt.Sprintf("id=eq.%s&user_id=eq.%s", task.ProjectID, userID)
	projectResp, err := config.Supabase.Select("projects", projectQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al verificar el proyecto"})
		return
	}
	defer projectResp.Body.Close()

	projectBody, err := io.ReadAll(projectResp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la respuesta del proyecto"})
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(projectBody, &projects); err != nil || len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarea no encontrada"})
		return
	}

	// Eliminar la tarea
	query := fmt.Sprintf("id=eq.%s", url.QueryEscape(taskID))
	resp, err := config.Supabase.Delete("tasks", query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar la tarea"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		c.JSON(resp.StatusCode, gin.H{"error": "Error al eliminar la tarea"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tarea eliminada correctamente"})
}

