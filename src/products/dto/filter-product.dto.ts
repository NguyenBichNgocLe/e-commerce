import { IsOptional } from "class-validator";

export class FilterProductDto {
    @IsOptional()
    search: string;

    @IsOptional()
    category: string;
}