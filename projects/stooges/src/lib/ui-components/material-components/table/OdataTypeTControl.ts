import { TControl } from "../../table/models/TControl";
import { Entity } from "../../../types";
import { MatTableEntityItem } from "./types";
import { getClassNameFromOdatTypeResource } from "../../../entity/get-class-name-from-odata-type-resource";

export class OdataTypeTConrol extends TControl {
  constructor(data?: Partial<OdataTypeTConrol>) {
    super();
    Object.assign(this, data);
  }

  entityItems: MatTableEntityItem[]

  generateOdataTypeByResource(resource: Entity) {
    let className = getClassNameFromOdatTypeResource(resource);
    return this.entityItems.find(e => e.class.name == className)!.display;
  }
}