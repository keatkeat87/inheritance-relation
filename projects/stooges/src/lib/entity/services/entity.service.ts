import { METADATA_KEY } from '../../decorators/metadata-key';
import { Inject, Injectable } from '@angular/core';
import { EntityConfig, ENTITY_CONFIG } from './entity-config';
import { UploadedPathService } from '../../common/services/uploaded-path.service';
import { Constructor } from '../../types';
import { ResourcesMetadata } from '../../decorators/Resources';
import { SImage } from '../../models/Image';
import { SFile } from '../../models/File';
import { ResourceMetadata } from '../../decorators/Resource';
import { EnumMetadata } from '../../decorators/Enum';
import { JsonMetadata } from '../../decorators/Json';
import { ImageMetadata } from '../../decorators/ImageDecorator';
import { FileMetadata } from '../../decorators/FileDecorator';
import { isObject, isMomentObject } from '../../common/methods';
import { ComplexTypeMetadata } from '../../decorators/ComplexType';
import { LanguageService } from '../../language/language.service';
import { odataType } from '../types';
import { getClassNameFromOdatTypeResource } from '../get-class-name-from-odata-type-resource';


interface SQLRole { RoleId: number; UserId: number; }

@Injectable({
 providedIn : 'root'
})
export class EntityService {

    constructor(
        @Inject(ENTITY_CONFIG) public config: EntityConfig, // public 只是为了方便 debug 用
        private languageService: LanguageService,
        private uploadedPathService: UploadedPathService
    ) { }

    private defineForTranslate(resource: any, keyWithoutTranslate: string): any {

        const translateKey = this.languageService.pretty(this.languageService.currentLanguage);

        Object.defineProperty(resource, keyWithoutTranslate, {
            get: function () {
                return this[keyWithoutTranslate + '_' + translateKey];
            },
            enumerable: false,
            configurable: true
        });
        return resource;
    }

    private getResourceOrComplexTypeConstructor(resource: any, key: string): Constructor {
        const resourceMetadata = (Reflect.getMetadata(METADATA_KEY.Resource, resource, key) as ResourceMetadata);
        const complexTypeMetadata = (Reflect.getMetadata(METADATA_KEY.ComplexType, resource, key) as ComplexTypeMetadata);
        if (resourceMetadata) {
            return resourceMetadata.getConstructor();
        }
        else {
            console.log(key);
            return complexTypeMetadata.getConstructor();
        }
    }


    /**
    * 这个不是 void 哦
    * 处理 Json, Date, Role, File, Image, Language, Resources, Resource, ComplexType, Ckeditor(图片), Otherable(万能 select) 与后台数据格式不同的转换
    * @param resource should be resource, but if resources 会智能 for loop
    * @param Constructor 对应 rsource 的类
    */
    parse(resource: any, constructor: Constructor): any {
        if (resource == null) return null;
        if (Array.isArray(resource)) {
            return (resource as any[]).map(r => {
                return this.parse(r, constructor);
            });
        } else {
            // 看 @odata.type, 替换成派生类
            if (resource[odataType]) {
                const entity = getClassNameFromOdatTypeResource(resource);
                constructor = this.config.entities[entity];
            }

            const instance = new constructor();

            const keyWithoutTranslateRecords: string[] = [];

            Object.keys(resource).forEach(key => {
                if (key.endsWith('_en')) {
                    const keyWithoutTranslate = key.substring(0, key.lastIndexOf('_en'));
                    if (keyWithoutTranslateRecords.indexOf(keyWithoutTranslate) == -1) {
                        keyWithoutTranslateRecords.push(keyWithoutTranslate);
                        this.defineForTranslate(instance, keyWithoutTranslate);
                    }
                }

                let value = resource[key];
                if (value != null) { 
                    if (isObject(value)) {
                        const nextConstructor = this.getResourceOrComplexTypeConstructor(instance, key);
                        instance[key] = this.parse(value, nextConstructor);
                    }
                    else if (Array.isArray(value)) {
                        const isRoles = Reflect.hasMetadata(METADATA_KEY.Roles, instance, key);
                        if (isRoles) {
                            instance[key] = resource[key].map((role: SQLRole) => {
                                return {
                                    Id: role.RoleId,
                                    Name: this.config.sqlRoles.singleOrDefault(s => s.Id == role.RoleId)!.Name
                                };
                            });
                        }
                        else {
                            const nextConstructor = (Reflect.getMetadata(METADATA_KEY.Resources, instance, key) as ResourcesMetadata).getConstructor();
                            instance[key] = (value as any[]).map(v => this.parse(v, nextConstructor));
                        }
                    }
                    else {
                        const isDatetime = Reflect.getMetadata(METADATA_KEY.Type, instance, key) === Date;
                        const isJson = Reflect.hasMetadata(METADATA_KEY.Json, instance, key);
                        const isImage = Reflect.hasMetadata(METADATA_KEY.Image, instance, key);
                        const isFile = Reflect.hasMetadata(METADATA_KEY.File, instance, key);
                        const isCkeditor = Reflect.hasMetadata(METADATA_KEY.Ckeditor, instance, key);
                        let enumMetadata = Reflect.getMetadata(METADATA_KEY.Enum, instance, key) as EnumMetadata;

                        const setupFile = (fileOrImage: SFile | SImage, sqlFileOrImage: Object) => {
                            // 复制过去就可以了
                            Object.keys(sqlFileOrImage).forEach(key => {
                                fileOrImage[key] = sqlFileOrImage[key];
                            });
                            if (fileOrImage.src != '') fileOrImage.src = this.uploadedPathService.nameToPath(fileOrImage.src);
                        };

                        if (isDatetime) {
                            instance[key] = new Date(resource[key]);
                        }
                        else if (enumMetadata && enumMetadata.multiple) {
                            instance[key] = JSON.parse(value);
                        }
                        else if (isJson) {
                            value = JSON.parse(value);
                            const metadata = Reflect.getMetadata(METADATA_KEY.Json, instance, key) as JsonMetadata;
                            if (metadata.hasConstructor) {
                                const nextConstructor = metadata.getConstructor();
                                if (Array.isArray(value)) {
                                    instance[key] = (value as any[]).map(v => this.parse(v, nextConstructor));
                                } else { // isObject
                                    instance[key] = this.parse(value, nextConstructor);
                                }
                            } else {
                                instance[key] = value;
                            }
                        }
                        else if (isImage || isFile) {
                            value = JSON.parse(value);
                            if (isImage) {
                                const metadata = (Reflect.getMetadata(METADATA_KEY.Image, instance, key) as ImageMetadata);
                                if (metadata.multiple) {
                                    instance[key] = (value as any[]).map(v => {
                                        const image = new SImage({ $metadata: metadata });
                                        setupFile(image, v);
                                        return image;
                                    });
                                }
                                else {
                                    // single 
                                    const image = new SImage({ $metadata: metadata });
                                    setupFile(image, value);
                                    instance[key] = image
                                }
                            }
                            else {
                                //isFile 
                                const metadata = (Reflect.getMetadata(METADATA_KEY.File, instance, key) as FileMetadata);
                                if (metadata.multiple) {
                                    instance[key] = (value as any[]).map(v => {
                                        const file = new SFile();
                                        setupFile(file, v);
                                        return file;
                                    });
                                }
                                else {
                                    // single 
                                    const file = new SFile();
                                    setupFile(file, value);
                                    instance[key] = file
                                }
                            }

                        }
                        else {
                            if (isCkeditor) {
                                value = this.uploadedPathService.ckeditorNameToPath(value);
                            }
                            instance[key] = value;
                        }
                    }
                } else {
                    instance[key] = value;
                }
            });

            return instance;
        }
    }

    /**
    * 这个不是 void 哦
    * 处理 Json, Date, File, Image, Resources, Resource, ComplexType, Ckeditor(图片), Otherable(万能 select) 与后台数据格式不同的转换
    */
    format(resource: any, constructor: Constructor): any {
        if (resource == null) return null;
        if (resource[odataType]) {
            const entity = getClassNameFromOdatTypeResource(resource);
            constructor = this.config.entities[entity];
        }
        const instance = new constructor();

        // 处理 otherable separate
        // 要 clone 因为不可以改到之前的 resource
        const cloneResource = {
            ...resource
        };

        Object.keys(cloneResource).forEach(key => {
            let value = cloneResource[key];
            if (value != null) {
                // note : moment date 其实不在我们的设计范围中，但是 material datepicker 需要是用 moment 沟通的 .
                // 所以为了方便处理 form value 我们在 format 这里做一个强转
                if (isMomentObject(value)) {
                    value = value.toDate();
                }
                const isJson = Reflect.hasMetadata(METADATA_KEY.Json, instance, key);
                const isImage = Reflect.hasMetadata(METADATA_KEY.Image, instance, key);
                const isFile = Reflect.hasMetadata(METADATA_KEY.File, instance, key);
                const isCkeditor = Reflect.hasMetadata(METADATA_KEY.Ckeditor, instance, key);
                let enumMetadata = Reflect.getMetadata(METADATA_KEY.Enum, instance, key) as EnumMetadata;

                if (isJson) {
                    const metadata = Reflect.getMetadata(METADATA_KEY.Json, instance, key) as JsonMetadata;
                    if (metadata.hasConstructor) {
                        const nextConstructor = metadata.getConstructor();
                        if (Array.isArray(value)) {
                            instance[key] = (value as any[]).map(v => this.format(v, nextConstructor));
                        } else { // isObject
                            instance[key] = this.format(value, nextConstructor);
                        }
                    }
                    instance[key] = JSON.stringify(value);
                }
                else if (enumMetadata && enumMetadata.multiple) {
                    instance[key] = JSON.stringify(value);
                }
                else if (isImage || isFile) {
                    const imageMetaData = (Reflect.getMetadata(METADATA_KEY.Image, instance, key) as ImageMetadata);
                    const fileMetaData = (Reflect.getMetadata(METADATA_KEY.File, instance, key) as FileMetadata);
                    const metadata: FileMetadata = imageMetaData || fileMetaData;
                    if (metadata.multiple) {
                        let datas : any[] = [];
                        datas = (value as SFile[]).map(v => {
                            const clone = { ...v };
                            if (clone.src != '') {
                                clone.src = this.uploadedPathService.pathToName(clone.src);
                            }
                            return clone;
                        });
                        instance[key] = JSON.stringify(datas);
                    } else {
                        // single
                        const clone = { ...value } as SFile;
                        if (clone.src != '') {
                            clone.src = this.uploadedPathService.pathToName(clone.src);
                        }
                        instance[key] = JSON.stringify(clone);
                    }
                }
                else {
                    if (isObject(value)) {
                        const nextConstructor = this.getResourceOrComplexTypeConstructor(instance, key);
                        instance[key] = this.format(value, nextConstructor);
                    } else if (Array.isArray(value)) {
                        const nextConstructor = (Reflect.getMetadata(METADATA_KEY.Resources, instance, key) as ResourcesMetadata).getConstructor();
                        instance[key] = (value as any[]).map(v => this.format(v, nextConstructor));
                    } else {
                        if (isCkeditor) {
                            value = this.uploadedPathService.ckeditorPathToName(value);
                        }
                        instance[key] = value;
                    }
                }
            }
            else {
                instance[key] = value;
            }
        });
        return instance;
    }






}
