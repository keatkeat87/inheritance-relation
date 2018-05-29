import { EGroupDirective } from './e-group.directive';
import { Directive, Input, OnInit } from '@angular/core';
import { EGroup } from '../models/EGroup';

@Directive({
  selector: '[eGroupName]'
})
export class EGroupNameDirective implements OnInit {

  constructor(
    private parent: EGroupDirective
  ) { }

  ngOnInit() {
    this.eGroup = this.parent.eGroup[this.eGroupName];
  }

  @Input()
  eGroupName: string;

  eGroup: EGroup;

}
