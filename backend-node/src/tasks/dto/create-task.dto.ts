import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Implementar autenticación JWT',
    minLength: 1
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example: 'Implementar sistema de autenticación usando JWT con Supabase',
    required: false
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Estado de la tarea',
    example: 'pending',
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
    required: false
  })
  @IsOptional()
  @IsIn(['pending', 'in progress', 'completed'])
  status?: string = 'pending';

  @ApiProperty({
    description: 'ID del proyecto al que pertenece la tarea',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsNotEmpty()
  project_id: string;
}