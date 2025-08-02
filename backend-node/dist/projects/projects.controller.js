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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(createProjectDto, req) {
        return this.projectsService.create(createProjectDto, req.user.id);
    }
    findAll(req) {
        return this.projectsService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.projectsService.findOne(id, req.user.id);
    }
    update(id, updateProjectDto, req) {
        return this.projectsService.update(id, updateProjectDto, req.user.id);
    }
    remove(id, req) {
        return this.projectsService.remove(id, req.user.id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear nuevo proyecto',
        description: 'Crea un nuevo proyecto para el usuario autenticado'
    }),
    (0, swagger_1.ApiBody)({ type: create_project_dto_1.CreateProjectDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Proyecto creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'Mi Proyecto Increíble' },
                description: { type: 'string', example: 'Descripción del proyecto' },
                user_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar proyectos del usuario',
        description: 'Obtiene todos los proyectos del usuario autenticado'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de proyectos obtenida exitosamente',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                    name: { type: 'string', example: 'Mi Proyecto Increíble' },
                    description: { type: 'string', example: 'Descripción del proyecto' },
                    user_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                    created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener proyecto por ID',
        description: 'Obtiene un proyecto específico del usuario autenticado'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proyecto', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Proyecto obtenido exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'Mi Proyecto Increíble' },
                description: { type: 'string', example: 'Descripción del proyecto' },
                user_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proyecto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar proyecto',
        description: 'Actualiza un proyecto específico del usuario autenticado'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proyecto', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiBody)({ type: update_project_dto_1.UpdateProjectDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Proyecto actualizado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'Mi Proyecto Actualizado' },
                description: { type: 'string', example: 'Descripción actualizada' },
                user_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                created_at: { type: 'string', example: '2025-08-02T10:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proyecto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar proyecto',
        description: 'Elimina un proyecto específico del usuario autenticado'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proyecto', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Proyecto eliminado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Proyecto eliminado exitosamente' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT requerido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proyecto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map