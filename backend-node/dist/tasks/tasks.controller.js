"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(createTaskDto, req) {
        return this.tasksService.create(createTaskDto, req.user.id);
    }
    findByProject(projectId, req) {
        return this.tasksService.findByProject(projectId, req.user.id);
    }
    findOne(id, req) {
        return this.tasksService.findOne(id, req.user.id);
    }
    update(id, updateTaskDto, req) {
        return this.tasksService.update(id, updateTaskDto, req.user.id);
    }
    remove(id, req) {
        return this.tasksService.remove(id, req.user.id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear nueva tarea',
        description: 'Crea una nueva tarea en un proyecto específico'
    }),
    (0, swagger_1.ApiBody)({ type: create_task_dto_1.CreateTaskDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tarea creada exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                title: { type: 'string', example: 'Implementar autenticación JWT' },
                description: { type: 'string', example: 'Descripción de la tarea' },
                status: { type: 'string', example: 'pending', enum: ['pending', 'in progress', 'completed'] },
                project_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar tareas por proyecto',
        description: 'Obtiene todas las tareas de un proyecto específico'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'project_id',
        description: 'ID del proyecto',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de tareas obtenida exitosamente',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                    title: { type: 'string', example: 'Implementar autenticación JWT' },
                    description: { type: 'string', example: 'Descripción de la tarea' },
                    status: { type: 'string', example: 'pending', enum: ['pending', 'in progress', 'completed'] },
                    project_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                    created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    __param(0, (0, common_1.Query)('project_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener tarea por ID',
        description: 'Obtiene una tarea específica del usuario autenticado'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la tarea', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarea obtenida exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                title: { type: 'string', example: 'Implementar autenticación JWT' },
                description: { type: 'string', example: 'Descripción de la tarea' },
                status: { type: 'string', example: 'pending', enum: ['pending', 'in progress', 'completed'] },
                project_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarea no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar tarea',
        description: 'Actualiza una tarea específica del usuario autenticado'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la tarea', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiBody)({ type: update_task_dto_1.UpdateTaskDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarea actualizada exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                title: { type: 'string', example: 'Implementar autenticación JWT actualizada' },
                description: { type: 'string', example: 'Descripción actualizada' },
                status: { type: 'string', example: 'in progress', enum: ['pending', 'in progress', 'completed'] },
                project_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarea no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar tarea',
        description: 'Elimina una tarea específica del usuario autenticado'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la tarea', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarea eliminada exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Tarea eliminada exitosamente' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarea no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map