
/*

note : 
这里有一些规范要跟 
1. name : string = ''; 一定要声明 :string 类型, 即使你后面已经通过 empty string 表明它是 string 了, 因为只有这样 Reflect 才能拿得到 
2. Id = 0, sort = 0, 为什么一定要 = 0 呢, 因为 server 是 int, post 的时候 should be 放 value 0 or langsung 不要有这个 property 才能接受. 
by logic we should use way 1, value = 0 咯



@Ckeditor()
description = '';

@Required()
title = '';

@Amount()
amount : number = null!;

@DateDecorator()
date : Date = new Date();

@Sort()
sort : number = 0;

import { Postcode } from './Postcode';
@Resource(forwardRef(() => Postcode))
postcode: Postcode

import { Postcode } from './Postcode';
@Resources(forwardRef(() => Postcode))
postcodes: Postcode[]
 
@Required()
@ImageDecorator({
    aspectRatio: '1:1',
    scenes: {
        'avatar,upload': '150w, 150w, 150w'
    }
})
image : Image = null!;
 
*/


export class Sample {

    static entityName = 'Samples';

    constructor(data?: Partial<Sample>) {
        Object.assign(this, data);
    }

    Id: number = undefined!;

    image: any;

    title: any;

    publishedDate : any;

}



