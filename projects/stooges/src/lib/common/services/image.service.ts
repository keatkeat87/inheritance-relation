import { Injectable } from '@angular/core';
import { DeviceService } from './device.service';
import { hasDecimalPoint } from '../../common/methods/has-decimal-point';
import { Dimension, ObjectFix } from '../../types';
import { ImageMetadata } from '../../decorators/ImageDecorator';

export class Description {

  constructor(data?: Partial<Description>) {
    Object.assign(this, data);
  }

  deviceRetina: DeviceRetina
  retina: number

  width: number // 有小数点 
  height: number // 有小数点 

  get widthAfterCeil(): number {
    return Math.ceil(this.width);
  }

  get heightAfterCeil(): number {
    return Math.ceil(this.height);
  }

  get widthAfterRetina(): number {
    return Math.ceil(this.width * this.retina);
  }

  get heightAfterRetina(): number {
    return Math.ceil(this.height * this.retina);
  }

  get pressWOrH(): 'w' | 'h' {
    return (!hasDecimalPoint(this.width)) ? 'w' : 'h';
  }

  get pressTo(): number {
    return this.pressWOrH == 'w' ? this.widthAfterRetina : this.heightAfterRetina;
  }

  srcset: string
  src: string
}

export class SImageData {

  constructor(data?: Partial<SImageData>) {
    Object.assign(this, data);
  }

  aspectRatioDimension: Dimension | null
  scenes: {
    name: string
    descriptions: Description[]
  }[]

  get maxWidthAfterRetinaAndAspectRatio(): number {
    let maxWidthAfterRetina = this.scenes.max(s => s.descriptions.max(d => d.widthAfterRetina || 0));
    return (this.aspectRatioDimension) ? Math.ceil(maxWidthAfterRetina / this.aspectRatioDimension.width) * this.aspectRatioDimension.width : maxWidthAfterRetina;
  }
  get maxHeightAfterRetinaAndAspectRatio(): number {
    let maxHeightAfterRetina = this.scenes.max(s => s.descriptions.max(d => d.heightAfterRetina || 0));
    return (this.aspectRatioDimension) ? Math.ceil(maxHeightAfterRetina / this.aspectRatioDimension.height) * this.aspectRatioDimension.height : maxHeightAfterRetina;
  }
  get maxWidthAfterCeilAndAspectRatio(): number {
    let maxWidthAfterCeil = this.scenes.max(s => s.descriptions.max(d => d.widthAfterCeil || 0));
    return (this.aspectRatioDimension) ? Math.ceil(maxWidthAfterCeil / this.aspectRatioDimension.width) * this.aspectRatioDimension.width : maxWidthAfterCeil;
  }
  get maxHeightAfterCeilAndAspectRatio(): number {
    let maxHeightAfterCeil = this.scenes.max(s => s.descriptions.max(d => d.heightAfterCeil || 0));
    return (this.aspectRatioDimension) ? Math.ceil(maxHeightAfterCeil / this.aspectRatioDimension.height) * this.aspectRatioDimension.height : maxHeightAfterCeil;
  }

  get pressWidths(): number[] {
    let pressWidths: number[] = [];
    this.scenes.forEach(s => {
      s.descriptions.forEach(d => {
        if (d.pressWOrH == 'w') pressWidths.push(d.pressTo);
      });
    });
    pressWidths = pressWidths.distinct();
    return pressWidths;
  }

  get pressHeights(): number[] {
    let pressHeights: number[] = [];
    this.scenes.forEach(s => {
      s.descriptions.forEach(d => {
        if (d.pressWOrH == 'h') pressHeights.push(d.pressTo);
      });
    });
    pressHeights = pressHeights.distinct();
    return pressHeights;
  }
}

export interface DeviceRetina {
  device: string
  deviceWidth: number
  maxRetina: number
}

@Injectable({
  providedIn : 'root'
})
export class ImageService {

  constructor(
    private deviceService: DeviceService
  ) { }

  // js 特区
  thumbnail(width: number, height: number, pressTo: number, pressWidthOrHeight: 'width' | 'height') {
    /*
        1500 * 500 
        800 * ?
        ? * 400
        
        formula 1 : 
        800 / (1500/500)
        400 * (1500/500)

        formula 2 :
        500 / (1500/800)
        1500 / (500/400)
    */
    let aspectRatioPercentage = width / height;
    return (pressWidthOrHeight == 'width') ? pressTo / aspectRatioPercentage : pressTo * aspectRatioPercentage;
  }

  getDescriptionForCurrentDevice(data: SImageData): Description {
    return data.scenes[0].descriptions
      .orderBy(['-retina'])
      .filter(d => d.deviceRetina.device == this.deviceService.device &&
        d.retina <= this.deviceService.devicePixelRatio)[0];
  }

  getBiggestDescription(data: SImageData): Description {
    // 所有场景 descriptions 放一起, 比面积找出最大的 description
    let allDescriptions = data.scenes.reduce<Description[]>((result, scene) => {
      return result.concat(scene.descriptions);
    }, []);
    let final = allDescriptions.reduce<Description>((result, description) => {
      return (description.widthAfterRetina * description.heightAfterRetina > result.widthAfterRetina * result.heightAfterRetina) ? description : result;
    }, allDescriptions[0]);
    return final;
  }



  // js 特区 end 


  // 请依据 deviceWidth 排列 (小到大) , 表达式也是一样排列哦
  private deviceRetinas: DeviceRetina[] = [
    { device: 'mobile', deviceWidth: 420, maxRetina: 4 },
    { device: 'tablet', deviceWidth: 1024, maxRetina: 2 },
    { device: 'pc', deviceWidth: 1366, maxRetina: 2 },
  ]

  buildSizes(descriptions: Description[]): string {
    descriptions = descriptions.filter(d => d.retina == 1);
    let result : string[] = [];
    for (let i = 0; i < descriptions.length; i++) {
      let description = descriptions[i];
      result.push(`(max-width: ${description.deviceRetina.deviceWidth}px)${description.widthAfterCeil}px`);
      if (i == descriptions.length - 1) {
        result.push(`${description.widthAfterCeil}px`);
      }
    }
    return result.join(',');
  }

  aspectRatioToDimension(aspectRatio: string): Dimension {
    return {
      width: +aspectRatio.split(':')[0],
      height: +aspectRatio.split(':')[1]
    }
  }

  imageToFrame(imageWidth: number, imageHeight: number, frameWidth: number, frameHeight: number, objectFix: ObjectFix): Dimension {
    const imageRatioPercent = imageWidth / imageHeight;
    const frameRatioPercent = frameWidth / frameHeight;
    // contain and cover 刚好是倒反, 如果 percent 一样那么随便哪个都可以过
    const toWidth = (objectFix == 'contain') ? imageRatioPercent > frameRatioPercent : imageRatioPercent < frameRatioPercent;
    if (toWidth) {
      return {
        width: frameWidth,
        height: frameWidth / imageRatioPercent
      }
    }
    else {
      return {
        width: frameHeight * imageRatioPercent,
        height: frameHeight
      }
    }
  }

  private buildDescriptions(expression: string, deviceRetina: DeviceRetina, aspectRatioDimension: Dimension | null, imageWidth?: number, imageHeight?: number, imageSrc?: string): Description[] {
    let hasImageWidthHeight = imageWidth != undefined && imageHeight != undefined;
    // build 一个场景的一个 device
    const result: Description[] = [];
    let width: number = null!;
    let height: number = null!;
    if (aspectRatioDimension) {
      if (expression.endsWith('w')) {
        width = +expression.substring(0, expression.length - 'w'.length);
        height = width / (aspectRatioDimension.width / aspectRatioDimension.height)
      }
      else {
        // frame 吃
        const frameWidth = +expression.split('x')[0];
        const frameHeight = +expression.split('x')[1];
        const dimension = this.imageToFrame(aspectRatioDimension.width, aspectRatioDimension.height, frameWidth, frameHeight, 'cover');
        width = dimension.width;
        height = dimension.height;
      }
    }
    else {
      if (expression.endsWith('w')) {
        // 瀑布流
        width = +expression.substring(0, expression.length - 'w'.length);
        if (hasImageWidthHeight) height = width / (imageWidth! / imageHeight!);
      }
      else if (expression.endsWith('h')) {
        // 瀑布流
        height = +expression.substring(0, expression.length - 'h'.length);
        if (hasImageWidthHeight) width = height * (imageWidth! / imageHeight!);
      }
      else {
        // full screen 黑
        if (!hasImageWidthHeight) return []; // skip
        const frameWidth = +expression.split('x')[0];
        const frameHeight = +expression.split('x')[1];
        if (imageWidth! <= frameWidth && imageHeight! <= frameHeight) {
          width = imageWidth!;
          height = imageHeight!;
        }
        else {
          const dimension = this.imageToFrame(imageWidth!, imageHeight!, frameWidth, frameHeight, 'contain');
          width = dimension.width;
          height = dimension.height;
        }
      }
    }

    for (let retina = 1; retina <= deviceRetina.maxRetina; retina++) {
      let description = new Description({
        deviceRetina,
        retina,
        width,
        height
      });

      if (imageSrc) {
        const ipos = imageSrc.lastIndexOf('.');
        const imageName = imageSrc.substring(0, ipos);
        const extension = imageSrc.substring(ipos);
        description.src = `${imageName}-${description.widthAfterRetina + 'w' + extension}`;
        description.srcset = `${description.src} ${description.widthAfterRetina}w`;
      }
      result.push(description);
    }
    return result;
  }

  /**
   * @description 这里的 imageWidth,height 是 image after crop and before press
   * @param metadata 有 metadata 可以算出 upload 条件 (minWidth, minHeight)
   * @param imageWidth upload select image 之后输入 width,heigth 就可以计算告诉后端怎样压了
   * @param imageSrc 后端返回图片 src,width,height 就可以 build 出 srcset 了
   * @param specifyScene 优化 when get srcset 只处理一个场景
   */
  getData(metadata: ImageMetadata, imageWidth?: number, imageHeight?: number, imageSrc?: string, specifyScene?: string): SImageData {
    let aspectRatioDimension = (metadata.aspectRatio) ? this.aspectRatioToDimension(metadata.aspectRatio) : null;
    let result = new SImageData({
      aspectRatioDimension,
      scenes: Object.keys(metadata.scenes).filter(key => !specifyScene || key.split(',').map(v => v.clearSpace()).indexOf(specifyScene) != -1).map(key => {
        let fullExpression = metadata.scenes[key].clearSpace();
        const scene = {
          name: key,
          descriptions: [] as Description[]
        }
        fullExpression.split(',').forEach((expression, i) => {
          if (expression != '-') {
            const deviceRetina = this.deviceRetinas[i];
            scene.descriptions = scene.descriptions.concat(this.buildDescriptions(expression, deviceRetina, aspectRatioDimension, imageWidth, imageHeight, imageSrc));
          }
        });
        return scene;
      })
    });
    return result;
  }









}
