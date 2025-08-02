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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_config_1 = require("../config/supabase.config");
let TasksService = class TasksService {
    configService;
    supabase;
    constructor(configService) {
        this.configService = configService;
        this.supabase = (0, supabase_config_1.createSupabaseClient)(this.configService);
    }
    async create(createTaskDto, userId) {
        const { title, description, status, project_id } = createTaskDto;
        const { data: project, error: projectError } = await this.supabase
            .from('projects')
            .select('id')
            .eq('id', project_id)
            .eq('user_id', userId)
            .single();
        if (projectError || !project) {
            throw new common_1.ForbiddenException('No tienes acceso a este proyecto');
        }
        const { data: task, error } = await this.supabase
            .from('tasks')
            .insert([{ title, description, status: status || 'pending', project_id }])
            .select()
            .single();
        if (error) {
            throw new Error('Error al crear la tarea');
        }
        return task;
    }
    async findByProject(projectId, userId) {
        const { data: project, error: projectError } = await this.supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', userId)
            .single();
        if (projectError || !project) {
            throw new common_1.ForbiddenException('No tienes acceso a este proyecto');
        }
        const { data: tasks, error } = await this.supabase
            .from('tasks')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error('Error al obtener las tareas');
        }
        return tasks;
    }
    async findOne(id, userId) {
        const { data: task, error } = await this.supabase
            .from('tasks')
            .select(`
        *,
        projects!inner(user_id)
      `)
            .eq('id', id)
            .single();
        if (error || !task) {
            throw new common_1.NotFoundException('Tarea no encontrada');
        }
        if (task.projects.user_id !== userId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta tarea');
        }
        return task;
    }
    async update(id, updateTaskDto, userId) {
        await this.findOne(id, userId);
        const { data: task, error } = await this.supabase
            .from('tasks')
            .update(updateTaskDto)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error('Error al actualizar la tarea');
        }
        return task;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        const { error } = await this.supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error('Error al eliminar la tarea');
        }
        return { message: 'Tarea eliminada correctamente' };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map