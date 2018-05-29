import { filter, map } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, ViewChild, TemplateRef, ViewContainerRef, ViewChildren, QueryList } from '@angular/core';
import { OverlayRef, OverlayConfig, Overlay, OverlaySizeConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ImageService } from '../../common/services/image.service';
import { OverlayFrameComponent } from '../overlay/overlay-frame/overlay-frame.component';
import { SliderComponent } from '../slider/slider.component';
import { ZoomComponent } from '../zoom/zoom.component';
import { SImage } from '../../models/Image';
import { KeyCode, Dimension } from '../../types';


/*
   note :
   1. lightbox 的 slider 必须是不能 loop 的
   2. lightbox 的 slider 必须是 1 data = 1 page 的
*/

@Component({
  selector: 's-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private imageService: ImageService,
    private overlay: Overlay
  ) { }

  @Input()
  datas: any[]; // changeable

  @Input()
  titleKey: string;

  @Input()
  imageKey: string;

  @Input()
  imageScene: string;

  @ViewChild('popup', { read: TemplateRef })
  private popupTemplate: TemplateRef<any>;

  @ViewChild('overlayFrame', { read: OverlayFrameComponent })
  overlayFrame: OverlayFrameComponent;

  @ViewChild('slider', { read: SliderComponent })
  slider: SliderComponent;

  @ViewChild('overlayContainer', { read: ViewContainerRef })
  overlayContainer: ViewContainerRef;


  @ViewChildren(ZoomComponent)
  zoomQueryList: QueryList<ZoomComponent>;

  private overlayRef: OverlayRef | null;

  defaultPage: number;

  imageLoadedIndex: number; // for preload image

  imageLoadedIndexCollection: {
    [prop: number]: 'mark'
  } = {}; // for preload image

  /**
   * @param slider 必须使用参数把 slider 传进来, 因为模板渲染顺序, 此时的 this.slider 依然是 null
   */
  canShowImage(i: number, sliderDotIndex: number, sliderDotLength: number) {
    if (i == sliderDotIndex) return true;
    const isNext = i == (sliderDotIndex + 1);
    const currLoaded = this.imageLoadedIndexCollection[sliderDotIndex] != undefined;
    if (isNext && currLoaded) return true;
    const isPrev = i == (sliderDotIndex - 1);
    const hasNext = sliderDotIndex + 1 > sliderDotLength - 1;
    if (isPrev && currLoaded) {
      if (hasNext) {
         const nextLoaded = this.imageLoadedIndexCollection[sliderDotIndex + 1] != undefined;
         return nextLoaded;
      }
      else {
        return true;
      }
    }
    return false;
  }

  overlaySizeConfig: OverlaySizeConfig = {
    maxWidth: '1000px',
    maxHeight: '750px',
    width: '100%',
    height: '100vh'
  };

  ngOnInit() {

  }

  tryCloseOverlay() {
    if (this.zoomQueryList.toArray().some(zoom => zoom.zoomed)) return;
    this.closeOverlay();
  }

  private closeOverlay() {
    this.overlayRef!.detachBackdrop();
    this.overlayFrame.animationLeave();
  }

  /**
   * @param data 通过 data 来识别, 而不是 page, 因为比如外面的 slider 的 page concept 和里面不一定一样.
   */
  public show(data: any) {
    this.defaultPage = this.datas.findIndex(d => {
      return (d[this.imageKey] as SImage).src == (data[this.imageKey] as SImage).src;
    });
    if (this.overlayRef) this.disposeOverlayRef(); // 确保只有一个 overlay
    this.overlayRef = this.overlay.create(new OverlayConfig({
      maxWidth: this.overlaySizeConfig.maxWidth,
      maxHeight: this.overlaySizeConfig.maxHeight,
      positionStrategy: this.overlay.position()
        .global()
        .width(this.overlaySizeConfig.width as string)
        .height(this.overlaySizeConfig.height as string)
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true
    }));

    merge(
      this.overlayRef.keydownEvents().pipe(
        filter(e => e.keyCode == KeyCode.escape)
      ),
      this.overlayRef.backdropClick()
    ).subscribe(() => {
      this.closeOverlay();
    });

    this.overlayRef.keydownEvents().pipe(
      filter(e => (e.keyCode == KeyCode.arrowLeft && this.slider.page != 0) || (e.keyCode == KeyCode.arrowRight && this.slider.page != this.datas.length - 1)),
      map<KeyboardEvent, 'prev' | 'next'>(e => {
        return (e.keyCode == KeyCode.arrowLeft) ? 'prev' : 'next';
      })
    ).subscribe(prevOrNext => {
      this.slider[prevOrNext]();
    });

    const portal = new TemplatePortal(this.popupTemplate, this.overlayContainer);
    this.overlayRef.attach(portal);
    this.cdr.markForCheck();
  }

  disposeOverlayRef() {
    this.overlayRef!.dispose();
    this.overlayRef = null;
  }

  private cacheForImageWidthAndHeight: Map<any, Dimension> = new Map();

  private getImageWidthAndHeight(data: any): Dimension {
    const cacheDimension = this.cacheForImageWidthAndHeight.get(data);
    if (cacheDimension) return cacheDimension;
    const image = data[this.imageKey] as SImage;
    const imageData = this.imageService.getData(image.$metadata, image.width, image.height, image.src, this.imageScene);
    const imageDescription = this.imageService.getDescriptionForCurrentDevice(imageData);
    const dimension = {
      width: imageDescription.widthAfterCeil, // 用 width 兼顾了用户的 retina over 我们支持的
      height: imageDescription.heightAfterCeil
    };
    this.cacheForImageWidthAndHeight.set(data, dimension);
    return dimension;
  }

  getImageWidth(data: any) {
    return this.getImageWidthAndHeight(data).width;
  }

  getImageHeight(data: any) {
    return this.getImageWidthAndHeight(data).height;
  }

}
