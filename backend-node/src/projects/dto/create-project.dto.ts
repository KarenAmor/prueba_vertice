import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Nombre del proyecto',
    example: 'Mi Proyecto Increíble',
    minLength: 1
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del proyecto',
    example: 'Este es un proyecto para gestionar tareas de manera eficiente',
    required: false
  })
  @IsOptional()
  description?: string;
}