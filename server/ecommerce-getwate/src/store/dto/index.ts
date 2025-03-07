import { IsNotEmpty, IsString } from "class-validator";

export class CreateStore {
    @IsString()
    @IsNotEmpty()
    store_name: string
}