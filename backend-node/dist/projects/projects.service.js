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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_config_1 = require("../config/supabase.config");
let ProjectsService = class ProjectsService {
    configService;
    supabase;
    constructor(configService) {
        this.configService = configService;
        this.supabase = (0, supabase_config_1.createSupabaseClient)(this.configService);
    }
    async create(createProjectDto, userId) {
        const { name, description } = createProjectDto;
        const { data: project, error } = await this.supabase
            .from('projects')
            .insert([{ name, description, user_id: userId }])
            .select()
            .single();
        if (error) {
            throw new Error('Error al crear el proyecto');
        }
        return project;
    }
    async findAll(userId) {
        const { data: projects, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error('Error al obtener los proyectos');
        }
        return projects;
    }
    async findOne(id, userId) {
        const { data: project, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error || !project) {
            throw new common_1.NotFoundException('Proyecto no encontrado');
        }
        return project;
    }
    async update(id, updateProjectDto, userId) {
        await this.findOne(id, userId);
        const { data: project, error } = await this.supabase
            .from('projects')
            .update(updateProjectDto)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            throw new Error('Error al actualizar el proyecto');
        }
        return project;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        await this.supabase
            .from('tasks')
            .delete()
            .eq('project_id', id);
        const { error } = await this.supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) {
            throw new Error('Error al eliminar el proyecto');
        }
        return { message: 'Proyecto eliminado correctamente' };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map