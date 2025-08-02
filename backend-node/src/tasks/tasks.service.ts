import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../config/supabase.config';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private supabase;

  constructor(private configService: ConfigService) {
    this.supabase = createSupabaseClient(this.configService);
  }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const { title, description, status, project_id } = createTaskDto;

    // Verificar que el proyecto pertenece al usuario
    const { data: project, error: projectError } = await this.supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
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

  async findByProject(projectId: string, userId: string) {
    // Verificar que el proyecto pertenece al usuario
    const { data: project, error: projectError } = await this.supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
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

  async findOne(id: string, userId: string) {
    const { data: task, error } = await this.supabase
      .from('tasks')
      .select(`
        *,
        projects!inner(user_id)
      `)
      .eq('id', id)
      .single();

    if (error || !task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (task.projects.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta tarea');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    // Verificar que la tarea pertenece al usuario
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

  async remove(id: string, userId: string) {
    // Verificar que la tarea pertenece al usuario
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
}

