import { odataType, odataNameSpaceWithHash } from "./types";

export function getClassNameFromOdatTypeResource(resource: any): string {
    return (resource[odataType] as string).replace(odataNameSpaceWithHash, '');
}