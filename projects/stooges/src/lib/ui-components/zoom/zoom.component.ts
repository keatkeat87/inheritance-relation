import {
  Component, OnInit, ChangeDetectionStrategy, Input,
  AfterViewInit, ElementRef, ChangeDetectorRef, Optional, ViewChild, OnDestroy
} from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { HammerService } from '../../common/services/hammer.service';
import { ImageService } from '../../common/services/image.service';
import { ObjectFix, XY } from '../../types';
import { PropagatingHammerInput } from '../../stooges-app/hammer-config';
import { range } from '../../common/methods/range';
import { ZoomData } from './types';

/*
  note :
  1. 所有的 pointerX，pointerY 都是对应 frame
  2. decimal 对比都小心哦
  3. hammer bug pinch auto trigger panEnd ()
  4. 如果以后 ng-content 的内容要绑定 hammer 要留意. hammer vs hammer 一定是要调整的
*/
 
@Component({
  selector: 's-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoomComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private hostEL: ElementRef,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef,
    private hammerService: HammerService,
    @Optional() private parentSlider?: SliderComponent
  ) { }

  @Input()
  transformFrameWidth: number;

  @Input()
  transformFrameHeight: number;

  @Input()
  maxScale = 1;

  @Input()
  objectFit: ObjectFix | null;

  @Input()
  defaultScaleMode: 'min' | 'pinchable' = 'min';

  public defaultScale: number
  private defaultTraslateX: number
  private defaultTraslateY: number

  public resetToDefaultScale() {
    this.currentScale = this.defaultScale;
    this.traslateX = this.defaultTraslateX;
    this.traslateY = this.defaultTraslateY;
    this.cdr.markForCheck();
  }

  public get zoomed() {
    return this.currentScale > this.minScale;
  }

  private displayFrameWidth: number;
  private displayFrameHeight: number;

  traslateX: number;

  traslateY: number;

  public currentScale: number;

  private minScale: number;

  private get transformFrameWidthAfterScale() {
    return this.transformFrameWidth * this.currentScale;
  }
  private get transformFrameHeightAfterScale() {
    return this.transformFrameHeight * this.currentScale;
  }

  private get minX(): number {
    return (this.transformFrameWidthAfterScale > this.displayFrameWidth) ? -(this.transformFrameWidthAfterScale - this.displayFrameWidth) : (this.displayFrameWidth - this.transformFrameWidthAfterScale) / 2;
  }
  private get maxX(): number {
    return (this.transformFrameWidthAfterScale > this.displayFrameWidth) ? 0 : (this.displayFrameWidth - this.transformFrameWidthAfterScale) / 2;
  }
  private get minY(): number {
    return (this.transformFrameHeightAfterScale > this.displayFrameHeight) ? -(this.transformFrameHeightAfterScale - this.displayFrameHeight) : (this.displayFrameHeight - this.transformFrameHeightAfterScale) / 2;
  }
  private get maxY(): number {
    return (this.transformFrameHeightAfterScale > this.displayFrameHeight) ? 0 : (this.displayFrameHeight - this.transformFrameHeightAfterScale) / 2;
  }

  @ViewChild('transformAreaEl', { read: ElementRef })
  private transformAreaEl: ElementRef;

  /* 设计给配搭 parent 是 SSlider 用 */
  private sub: ISubscription;
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
  private canPan = true;
  /* end */

  private cacheCurrentScaleOnPinchStart: number;
  private cacheHammerScaleOnPinchMove: number;
  pinchStart(e: HammerInput) {
    this.cacheCurrentScaleOnPinchStart = this.currentScale;
    this.cacheHammerScaleOnPinchMove = 1;
    this.panStart(e, true);
  }
  pinchMove(e: HammerInput) {
    this.panMove(e, true);
    const rect = (this.transformAreaEl.nativeElement as HTMLElement).getBoundingClientRect();
    const pointerX = e.center.x - rect.left;
    const pointerY = e.center.y - rect.top;
    const adjust = e.scale - this.cacheHammerScaleOnPinchMove;
    const adjusted = (this.currentScale - this.cacheCurrentScaleOnPinchStart) / this.cacheCurrentScaleOnPinchStart;
    const final = adjust + adjusted;
    const nextScaleBeforeProtect = this.cacheCurrentScaleOnPinchStart + (this.cacheCurrentScaleOnPinchStart * final);
    this.zoom(pointerX, pointerY, nextScaleBeforeProtect, false);
    this.cacheHammerScaleOnPinchMove = e.scale;
  }

  public get data(): ZoomData {
    return {
      x: this.traslateX,
      y: this.traslateY,
      scale: this.currentScale
    };
  }

  ngAfterViewInit() {
    const rect = (this.hostEL.nativeElement as HTMLElement).getBoundingClientRect();
    this.displayFrameWidth = +rect.width.toFixed(2);
    this.displayFrameHeight = +rect.height.toFixed(2);
    const transformFrameDimension = this.imageService.imageToFrame(this.transformFrameWidth, this.transformFrameHeight, this.displayFrameWidth, this.displayFrameHeight, this.objectFit!);
    this.minScale = transformFrameDimension.width / this.transformFrameWidth;
    // 800 是我们认为可以 pinch 的大小
    let pinchableScale = (this.transformFrameWidth < 800) ? 1 : 800 / this.transformFrameWidth;
    if (this.defaultScaleMode == 'min') {
      this.currentScale = this.minScale;
    }
    else {
      this.currentScale = (pinchableScale < this.minScale) ? this.minScale : pinchableScale;
    }
    this.defaultScale = this.currentScale;
    this.traslateX = this.defaultTraslateX = (this.displayFrameWidth / 2) - (this.transformFrameWidth * this.currentScale / 2);
    this.traslateY = this.defaultTraslateY = (this.displayFrameHeight / 2) - (this.transformFrameHeight * this.currentScale / 2);
    this.objectFit = null;

    if (this.parentSlider) {
      const cacheXYScale = {
        traslateX: this.traslateX,
        traslateY: this.traslateY,
        currentScale: this.currentScale,
      };
      this.sub = this.parentSlider.pageChangeDoneEmitter.subscribe(() => {
        this.traslateX = cacheXYScale.traslateX;
        this.traslateY = cacheXYScale.traslateY;
        this.currentScale = cacheXYScale.currentScale;
        this.cdr.markForCheck();
      });
    }
    setTimeout(() => {
      this.cdr.markForCheck();
    });
  }

  /*
    fix hammer bug pinch auto trigger panEnd...
    refer https://github.com/hammerjs/hammer.js/issues/1134
  */
  private pinchEndRecordTime: Date;
  panEnd(e: PropagatingHammerInput) {
    if (this.pinchEndRecordTime) {
      if (+new Date() - +this.pinchEndRecordTime <= 50) {
        e.stopPropagation();
      }
    }
  }
  pinchEnd() {
    this.pinchEndRecordTime = new Date();
  }
  /* end */

  private cacheHammerDeltaOnPanMove: XY;
  panStart(e: HammerInput, fromPinch = false) {
    if (this.parentSlider && !fromPinch) {
      const rect = (this.hostEL.nativeElement as HTMLElement).getBoundingClientRect();
      let clientX: number = null!;
      if (e.srcEvent instanceof MouseEvent || e.srcEvent instanceof PointerEvent) {
        clientX = e.srcEvent.clientX;
      }
      else if (e.srcEvent instanceof TouchEvent) {
        clientX = e.srcEvent.changedTouches[0].clientX;
      }
      const pointerX = clientX - rect.left;

      const edge = this.displayFrameWidth * 0.1;
      const pointerXInLeftEdge = pointerX > this.displayFrameWidth - edge;
      const pointerXInRightEdge = pointerX < edge;

      const hitPanLeftEnd = (this.hammerService.isPanLeft(e) && Math.abs(this.traslateX - this.minX) < 1);
      const hitPanRightEnd = (this.hammerService.isPanRight(e) && Math.abs(this.traslateX - this.maxX) < 1);

      const parentSliderCanPan = hitPanLeftEnd || hitPanRightEnd || pointerXInLeftEdge || pointerXInRightEdge;

      this.parentSlider.setCanPan(parentSliderCanPan);
      this.canPan = !parentSliderCanPan;
      if (!this.canPan) return;
    }
    this.cacheHammerDeltaOnPanMove = { x: 0, y: 0 };
  }

  panMove(e: HammerInput, _fromPinch = false): void {
    if (this.parentSlider && !this.canPan) return;
    const [deltaX, deltaY] = [
      e.deltaX - this.cacheHammerDeltaOnPanMove.x,
      e.deltaY - this.cacheHammerDeltaOnPanMove.y
    ];
    this.traslateX = this.protectRange(this.traslateX + deltaX, this.minX, this.maxX);
    this.traslateY = this.protectRange(this.traslateY + deltaY, this.minY, this.maxY);
    this.cacheHammerDeltaOnPanMove = { x: e.deltaX, y: e.deltaY };
  }

  private protectRange(num: number, min: number, max: number) {
    return (num < min) ? min : (num > max) ? max : num;
  }

  transition: number;

  private zoom(x: number, y: number, nextScaleBeforeProtect: number, animation: boolean) {
    const prevScale = this.currentScale;
    this.currentScale = this.protectRange(nextScaleBeforeProtect, this.minScale, this.maxScale);
    if (animation) {
      const time = 300;
      this.transition = time;
      setTimeout(() => {
        this.transition = 0;
        this.cdr.markForCheck();
      }, time);
    }
    const scalePercentInDecimal = this.currentScale / prevScale;
    const adjustX = (x * scalePercentInDecimal) - x;
    const adjustY = (y * scalePercentInDecimal) - y;
    this.traslateX = this.protectRange(this.traslateX - adjustX, this.minX, this.maxX);
    this.traslateY = this.protectRange(this.traslateY - adjustY, this.minY, this.maxY);
  }

  dblclick(e: MouseEvent) {
    const eachZoom = 1000; // px
    const minTransformFrameWidth = this.minScale * this.transformFrameWidth;
    const scaleAbleWidth = (this.transformFrameWidth * this.maxScale) - minTransformFrameWidth; // 最大 - 最小

    if (scaleAbleWidth == 0) return;
    const zoomCount = Math.round(scaleAbleWidth / eachZoom) || 1; // round adjust, 但是 0 不行，最少是 1.
    const eachZoomScaleInPx = scaleAbleWidth / zoomCount;

    const nextTargets = range(0, zoomCount).map((_v, i) => {
      return minTransformFrameWidth + ((i + 1) * eachZoomScaleInPx);
    });
    const nextTarget = nextTargets.filter(nextTarget => nextTarget > Math.ceil(this.transformFrameWidthAfterScale))[0];
    if (nextTarget == null) {
      this.wheel(e, true, -scaleAbleWidth);
    }
    else {
      this.wheel(e, true, nextTarget - this.transformFrameWidthAfterScale);
    }
  }

  wheel(e: MouseEvent, fromDoubleClick: boolean, addOrMinus: number): void;
  wheel(e: WheelEvent): void;
  wheel(e: WheelEvent | MouseEvent, fromDoubleClick = false, addOrMinus?: number) {
    const rect = (this.transformAreaEl.nativeElement as HTMLElement).getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    if (fromDoubleClick) {
      addOrMinus = addOrMinus!;
    }
    else {
      e.preventDefault();
      const eachScalePx = 100;
      addOrMinus = ((e as WheelEvent).deltaY <= 0) ? +eachScalePx : -eachScalePx;
    }
    const percentInDecimal = addOrMinus / this.transformFrameWidthAfterScale;
    const nextScaleBeforeProtect = this.currentScale + (this.currentScale * percentInDecimal);
    const animation = fromDoubleClick;
    this.zoom(pointerX, pointerY, nextScaleBeforeProtect, animation);
  }

  ngOnInit() {

  }



}
