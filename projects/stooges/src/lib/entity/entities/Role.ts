import { Key } from "../../decorators/Key";
import { Type } from "../../decorators/Type";

export class Role
{
    @Key()
    public Id: number;

    @Type()
    public Name: string;

    @Type()
    public disabled: boolean;
}
