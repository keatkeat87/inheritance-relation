import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  ContentChildren,
  QueryList
} from '@angular/core';
import { HammerService } from '../../common/services/hammer.service';

/*
帮助回忆 :
  1. 只支持 banner, 1 卡片 = 1 page, 没有 loop, autoplay
*/

@Component({
  selector: 's-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private cdr: ChangeDetectorRef,
    private hammerService: HammerService
  ) { }

  @Input()
  defaultTransition = 300;

  @Input()
  defaultPage = 0;

  @Output('sliderPanEnd')
  sliderPanEndEmitter = new EventEmitter<void>();

  @ContentChildren('card', { read: ElementRef })
  cardEls: QueryList<ElementRef>;
 
  // 设计给 child 用的, 比如 sZoom
  public pageChangeDoneEmitter = new EventEmitter<{ from: number, to: number }>();

  /* 设计给 sZoom 用的 */
  private canPan = true;
  public setCanPan(canPan: boolean) {
    this.canPan = canPan;
    this.cdr.markForCheck();
  }
  /*end*/

  translateX: number;
  transition: number;
  private cardWidth: number;
  private maxTranslateX = 0;

  get minTranslateX() {
    return -((this.cardEls.length - 1) * this.cardWidth);
  }

  // 也表示了 page length 咯
  get lastPage() {    
    return this.cardEls.length - 1;
  }

  ngOnInit() {
    this.transition = this.defaultTransition;
    this.translateX = 0;
    // render 的时候不需要理会 default page 的值, 始终显示第一张, 因为 page concapt 只有在 AfterViewInit 后才能算出
    this._page = this.defaultPage;
  }

  ngAfterViewInit() {
    this.cardWidth = (this.cardEls.toArray()[0].nativeElement as HTMLDivElement).getBoundingClientRect().width;
    if (this.page != 0) {
      this.transition = 0;
      const nextTranslateX = -(this.page * this.cardWidth);
      this.translateX = (nextTranslateX < this.minTranslateX) ? this.minTranslateX : nextTranslateX;

      setTimeout(() => {
        this.cdr.markForCheck();
        setTimeout(() => {
          this.transition = this.defaultTransition;
          this.cdr.markForCheck();
        });
      });
    }
  }


  private cacheTranslateX: number;
  panStart(_e: HammerInput) {
    if (!this.canPan) return;
    this.cacheTranslateX = this.translateX;
    this.transition = 0;
  }

  panMove(e: HammerInput) {
    if (!this.canPan) return;
    const nextTranslateX = this.cacheTranslateX + e.deltaX;
    if (nextTranslateX > this.maxTranslateX) {
      const gap = nextTranslateX - this.maxTranslateX;
      this.translateX = this.maxTranslateX + (gap / 4);
    }
    else if (nextTranslateX < this.minTranslateX) {
      const gap = nextTranslateX - this.minTranslateX;
      this.translateX = this.minTranslateX + (gap / 4);
    }
    else {
      this.translateX = this.cacheTranslateX + e.deltaX;
    }
  }

  panEnd(e: HammerInput) {
    if (!this.canPan) return;
    const minPanDeltaForEffect = 100;

    this.transition = this.defaultTransition;
    const nextTranslateX = this.cacheTranslateX + e.deltaX;
    const positiveDeltaX = Math.abs(e.deltaX);
    const canMove = this.hammerService.isPanEqualSwipe(e) || positiveDeltaX >= minPanDeltaForEffect;
    if (!canMove || (nextTranslateX > this.maxTranslateX || nextTranslateX < this.minTranslateX)) {
      this.translateX = this.cacheTranslateX;
    }
    else if (canMove) {
      const panLeft = e.deltaX < 0;
      if (panLeft) {
        this.next();
      }
      else {
        this.prev();
      }
    }
    this.sliderPanEndEmitter.emit();
  }

  public next() {
    this.page++;
    this.cdr.markForCheck();
  }
  public prev() {
    this.page--;
    this.cdr.markForCheck();
  } 

  private _page: number;
  public get page() {
    return this._page;
  }
  public set page(nextPage) {
    const prevPage = this._page;
    this._page = nextPage;
    const nextTranslateX = -(this.page * this.cardWidth);
    this.translateX = (nextTranslateX < this.minTranslateX) ? this.minTranslateX : nextTranslateX;
    setTimeout(() => {
      this.pageChangeDoneEmitter.emit({ from: prevPage, to: nextPage });
    }, this.transition);
    this.cdr.markForCheck();
  }

  ngOnDestroy() {

  }
}
