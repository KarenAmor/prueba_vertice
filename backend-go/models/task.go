package models

import (
	"time"
)

type Task struct {
	ID          string    `json:"id"`
	ProjectID   string    `json:"project_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateTaskRequest struct {
	ProjectID   string  `json:"project_id" binding:"required"`
	Title       string  `json:"title" binding:"required"`
	Description *string `json:"description"`
	Status      string  `json:"status"`
}

type UpdateTaskRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Status      *string `json:"status"`
}

