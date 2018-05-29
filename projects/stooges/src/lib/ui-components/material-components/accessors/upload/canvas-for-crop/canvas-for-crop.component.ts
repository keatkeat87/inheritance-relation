import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 's-mat-canvas-for-crop',
  templateUrl: './canvas-for-crop.component.html',
  styleUrls: ['./canvas-for-crop.component.scss']
})
export class MatCanvasForCropComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input()
  image: HTMLImageElement; // 原始图, width, height 都是原始的

  @Input()
  orientation: number;

  ngOnInit() {

   }

  @ViewChild('canvasEl', { read: ElementRef }) canvasEl: ElementRef;
  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = this.canvasEl.nativeElement;
    const { image, orientation } = this;
    if (orientation == 3) { // 180
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.rotate(180 * Math.PI / 180);
      context.drawImage(image, image.height, -image.width);
    }
    else if (orientation == 8) { // -90
      canvas.height = image.width;
      canvas.width = image.height;
      const context = canvas.getContext('2d')!;
      context.rotate(-90 * Math.PI / 180);
      context.drawImage(image, -image.width, 0);
    }
    else if (orientation == 6) { // 90
      canvas.height = image.width;
      canvas.width = image.height;
      const context = canvas.getContext('2d')!;
      context.rotate(90 * Math.PI / 180);
      context.drawImage(image, 0, -image.height);
    }
    else {
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
    }
  }
}
