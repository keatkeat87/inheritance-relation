import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TITLE_META_DESCRIPTION_CONFIG, TitleMetaDescriptionConfig } from './title-meta-description-config';
import { TitleMetaDescription, RobotsValue, RobotsRule } from '../../types';
 
@Injectable({
  providedIn: 'root'
})
export class TitleMetaDescriptionService {

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(TITLE_META_DESCRIPTION_CONFIG) private config: TitleMetaDescriptionConfig,
    private activatedRoute: ActivatedRoute
  ) { }

  update(titleMeta: TitleMetaDescription) {
    this.title.setTitle(titleMeta.title + ' | ' + this.config.titleSuffix);
    this.meta.updateTag({ content: titleMeta.metaDescription || '' }, 'name="description"');
  }
  
  // call in root level (AppComponent or StoogesAppComponent)
  setup() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(_ => {

      // 处理 robots
      // 如果 self 没有定义, 就看父亲定义的 children, 如果也没有就看 default 定义
      // 逻辑还是简单的
      // 每个人都可以定义 self , self 是王
      // 每个人也可以定义 children, children 会被 self 覆盖
      // 最糟糕的情况就是每个人自己定义好 self 就可以了.

      let children: RobotsValue = 'index, follow';
      let tempActivatedRoute = this.activatedRoute; // start will AppComponent
      // 递归往下爬
      for (let i = 0; i < 100; i++) {
        const rule: RobotsRule = tempActivatedRoute.snapshot.data['robotsRule'];
        if (rule) {
          if (rule.children) children = rule.children;
        }
        const next = tempActivatedRoute.children.find(c => c.outlet == 'primary');
        if (next) {
          tempActivatedRoute = next;
          continue;
        }
        else {
          const robotsValue = (rule && rule.self) ? rule.self : children;
          this.meta.updateTag({ content: robotsValue }, 'name="robots"');
          break;
        }
      }

      // 处理 title and metaDescription
      tempActivatedRoute = this.activatedRoute; // start from AppComponent
      // 递归往下爬
      for (let i = 0; i < 100; i++) {
        const next = tempActivatedRoute.children.find(c => c.outlet == 'primary');
        if (next) {
          tempActivatedRoute = next;
          continue;
        }
        else {
          let title = tempActivatedRoute.snapshot.data['title'];
          let metaDescription = tempActivatedRoute.snapshot.data['metaDescription'];
          if (title) {
            this.update({ title: title, metaDescription: metaDescription });
          }
          break;
        }
      }
    });
  }
}
