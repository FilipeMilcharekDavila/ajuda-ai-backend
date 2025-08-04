import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @IsDateString()
  @IsNotEmpty()
  data_evento: string;

  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;
}