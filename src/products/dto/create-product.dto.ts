import { IsNumber, Length, Min } from "class-validator";

export class CreateProductDto {
    @Length(1, 500, { message: 'Name of the product must be between 1 and 500 characters' })
    name: string;

    @Length(1, 1000, { message: 'Description of the product must be between 1 and 1000 characters' })
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with up to 2 decimal places' })
    @Min(0, { message: 'Price must be a positive number' })
    price: number;

    @Length(1, 250, { message: 'Category of the product must be between 1 and 250 characters' })
    category: string;
}