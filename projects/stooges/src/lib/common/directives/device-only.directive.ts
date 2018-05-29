import { DeviceService } from '../services/device.service';
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Device } from '../../types';
import { Subscription } from 'rxjs';

// <div *sDeviceOnly="['pc','tablet']" >test</div>
@Directive({
  selector: '[sDeviceOnly]'
})
export class DeviceOnlyDirective implements OnInit, OnDestroy {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private deviceService: DeviceService,
    private platform: Platform,
    private cdr: ChangeDetectorRef
  ) { }

  @Input()
  sDeviceOnly: Device[]

  sub = new Subscription();
  private showing = false;

  ngOnInit() {
    if (this.platform.isBrowser) {
      this.sub.add(this.deviceService.device$.subscribe(currentDevice => {
        const matchDevices = this.sDeviceOnly;
        const match = matchDevices.indexOf(currentDevice) != -1;
        if (match && !this.showing) {
          this.showing = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
          this.cdr.markForCheck();
        }
        else if (!match && this.showing) {
          this.showing = false;
          this.viewContainerRef.clear();
          this.cdr.markForCheck();
        }
      }))
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
