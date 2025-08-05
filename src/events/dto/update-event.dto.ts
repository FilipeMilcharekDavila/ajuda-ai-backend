import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  localizacao?: string;

  @IsDateString()
  @IsOptional()
  data_evento?: string;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;
}
