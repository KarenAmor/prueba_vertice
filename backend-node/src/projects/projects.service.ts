import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../config/supabase.config';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private supabase;

  constructor(private configService: ConfigService) {
    this.supabase = createSupabaseClient(this.configService);
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
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

  async findAll(userId: string) {
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

  async findOne(id: string, userId: string) {
    const { data: project, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    // Verificar que el proyecto pertenece al usuario
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

  async remove(id: string, userId: string) {
    // Verificar que el proyecto pertenece al usuario
    await this.findOne(id, userId);

    // Eliminar primero las tareas asociadas
    await this.supabase
      .from('tasks')
      .delete()
      .eq('project_id', id);

    // Eliminar el proyecto
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
}

