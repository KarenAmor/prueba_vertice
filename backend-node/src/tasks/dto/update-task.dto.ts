import { IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Nuevo título de la tarea',
    example: 'Implementar autenticación JWT actualizada',
    required: false
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Nueva descripción de la tarea',
    example: 'Descripción actualizada de la tarea',
    required: false
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Nuevo estado de la tarea',
    example: 'in progress',
    enum: ['pending', 'in progress', 'completed'],
    required: false
  })
  @IsOptional()
  @IsIn(['pending', 'in progress', 'completed'])
  status?: string;
}