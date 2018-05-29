import { Constructor, Entity } from "../../../types";
import { AbstractResourceService } from "../../../entity/services";

export interface MatTableGenerateRowNgClassFn<T> {
  (resource: T, index: number): {
    [propName: string]: boolean
  };
}

export type MatTableEntityItem = {
  display: string,
  class: Constructor
  resourceService: AbstractResourceService<Entity>,
  parent: Constructor | null
};