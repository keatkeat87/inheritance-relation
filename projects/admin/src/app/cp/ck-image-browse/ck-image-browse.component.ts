import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { SImage, ImageMetadata } from '../../../../../stooges/src/public_api';

@Component({
  templateUrl: './ck-image-browse.component.html',
  styleUrls: ['./ck-image-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CkImageBrowseComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  image: FormControl;
  imageMetadata: ImageMetadata;

  ngOnInit() {
    if (window.opener == null) {
      this.router.navigateByUrl('/admin');
    }
    this.image = new FormControl(null);
    this.imageMetadata = new ImageMetadata({
      haveUseOriginal : true,
      onlyExtensions: ['.jpg', '.jpeg', '.gif']
    });
    this.image.valueChanges.pipe(take(1)).subscribe((img: SImage) => {
      const ck: any = window.opener['CKEDITOR'];
      const num = this.activatedRoute.snapshot.queryParamMap.get('CKEditorFuncNum');
      ck.tools.callFunction(num, img.src);
      window.close();
    });
  }
}

