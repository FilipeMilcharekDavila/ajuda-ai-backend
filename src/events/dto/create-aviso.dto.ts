import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAvisoDto {
  @IsString()
  @IsNotEmpty()
  mensagem: string;
}