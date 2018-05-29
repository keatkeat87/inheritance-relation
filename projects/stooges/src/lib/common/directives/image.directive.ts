import { ImageService } from '../services/image.service';
import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { SImage } from '../../models/Image';

@Directive({
  selector: '[sImage]'
})
export class ImageDirective implements OnInit, OnChanges {

  constructor(
    private imageElem: ElementRef,
    private renderer: Renderer2,
    private imageService: ImageService
  ) { }

  @Input('sImage')
  info: [SImage, string];

  private setToElem() {
    const image = this.info[0];
    if (image == null) {
      this.renderer.setAttribute(this.imageElem.nativeElement, 'src', ''); // 没有就空
      this.renderer.setAttribute(this.imageElem.nativeElement, 'srcset', ''); // 没有就空
      this.renderer.setAttribute(this.imageElem.nativeElement, 'sizes', ''); // 没有就空
    }
    else {
      // 不需要 width, height
      // this.renderer.setProperty(this.imageElem.nativeElement, 'width', image.width);
      // this.renderer.setProperty(this.imageElem.nativeElement, 'height', image.height);

      const imageData = this.imageService.getData(image.$metadata, image.width, image.height, image.src, this.info[1]);
      let descriptions = imageData.scenes[0].descriptions;
      if (this.info[2]) {
        // need combine
        const image2 = this.info[2] as SImage;
        const imageData2 = this.imageService.getData(image2.$metadata, image2.width, image2.height, image2.src, this.info[3] as string);
        descriptions = [
          ...descriptions,
          ...imageData2.scenes[0].descriptions
        ].orderBy(['deviceRetina.deviceWidth']);
      }

      this.renderer.setAttribute(this.imageElem.nativeElement, 'sizes', this.imageService.buildSizes(descriptions));
      // 要 filter 掉 srcset null 哦

      const srcset = descriptions.distinct((d1,d2) => d1.widthAfterRetina === d2.widthAfterRetina).filter(d => d.srcset != null).map(d => d.srcset).join(',');
      this.renderer.setProperty(this.imageElem.nativeElement, 'srcset', srcset);
      // 放最大张的吧, 只有 seo 不读 srcset.
      this.renderer.setAttribute(this.imageElem.nativeElement, 'src', descriptions.orderBy(['-widthAfterRetina'])[0].src);

    }
  }

  ngOnInit() {
    this.setToElem();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['info'];
    if (!change.firstChange) {
      this.setToElem();
    }
  }

}
