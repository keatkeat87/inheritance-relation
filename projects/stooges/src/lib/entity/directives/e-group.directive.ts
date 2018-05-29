import { Directive, Input } from '@angular/core';
import { EGroup } from '../models/EGroup';

@Directive({
  selector: '[eGroup]'
})
export class EGroupDirective {

  constructor() { }

  @Input()
  eGroup: EGroup;

}
