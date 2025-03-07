import { IsArray, IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, Max, MaxLength, ValidateIf } from "class-validator"

export class Register {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @MaxLength(15)
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    password: string

    user_role: string

    @IsString()
    @IsNotEmpty()
    full_name: string

    user_create: Date;
}

export class Login {
    @ValidateIf((o) => !o.phone)
    @IsEmail()
    email: string | null;

    @ValidateIf((o) => !o.email)
    @IsNotEmpty()
    @IsString()
    phone: string;
    @IsNotEmpty()
    @IsString()
    password: string


}
export class Update {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @MaxLength(15)
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    full_name: string
}

export class info {
    @MaxLength(255)
    user_title: string
    user_description: string
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    user_image: string[]
}

export class address {
    country: string
    city: string
    province: string
    district: string
    full_address: string
    wards: string
}