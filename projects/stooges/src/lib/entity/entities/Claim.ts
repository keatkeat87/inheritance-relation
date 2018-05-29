import { Key } from "../../decorators/Key";
import { Type } from "../../decorators/Type";

export class Claim {
    
    @Key()
    Id: number;

    @Type()
    UserId: number;

    @Type()
    ClaimType: string;

    @Type()
    ClaimValue: string;
}
