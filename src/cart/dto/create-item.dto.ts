import { IsNumber, Min } from "class-validator";

export class CreateItemDto {
    @IsNumber({}, { message: 'Product ID must be a number' })
    productId: number;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;
}