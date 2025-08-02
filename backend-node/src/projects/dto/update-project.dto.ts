import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Nuevo nombre del proyecto',
    example: 'Mi Proyecto Actualizado',
    required: false
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Nueva descripción del proyecto',
    example: 'Descripción actualizada del proyecto',
    required: false
  })
  @IsOptional()
  description?: string;
}