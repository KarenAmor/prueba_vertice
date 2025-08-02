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
  ValidationPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nuevo proyecto',
    description: 'Crea un nuevo proyecto para el usuario autenticado'
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  create(@Body(ValidationPipe) createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar proyectos del usuario',
    description: 'Obtiene todos los proyectos del usuario autenticado'
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener proyecto por ID',
    description: 'Obtiene un proyecto específico del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID del proyecto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar proyecto',
    description: 'Actualiza un proyecto específico del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID del proyecto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateProjectDto: UpdateProjectDto,
    @Request() req
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar proyecto',
    description: 'Elimina un proyecto específico del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID del proyecto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Proyecto eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Proyecto eliminado exitosamente' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT requerido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id);
  }
}