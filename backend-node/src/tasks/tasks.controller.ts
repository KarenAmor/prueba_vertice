import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  ValidationPipe,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva tarea',
    description: 'Crea una nueva tarea en un proyecto específico'
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  create(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar tareas por proyecto',
    description: 'Obtiene todas las tareas de un proyecto específico'
  })
  @ApiQuery({ 
    name: 'project_id', 
    description: 'ID del proyecto', 
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  findByProject(@Query('project_id') projectId: string, @Request() req) {
    return this.tasksService.findByProject(projectId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener tarea por ID',
    description: 'Obtiene una tarea específica del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar tarea',
    description: 'Actualiza una tarea específica del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @Request() req
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar tarea',
    description: 'Elimina una tarea específica del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarea eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Tarea eliminada exitosamente' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id);
  }
}