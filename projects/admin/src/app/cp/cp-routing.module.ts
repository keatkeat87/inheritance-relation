import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CPComponent } from './cp.component';
import { CkImageBrowseComponent } from './ck-image-browse/ck-image-browse.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: CPComponent,           
            children: [               
                {
                    path: 'carousels',
                    loadChildren: './+carousel/carousel.module#CarouselModule',
                },
                {
                    path: 'faqs',
                    loadChildren: './+faq/faq.module#FAQModule',
                },   
                {
                    path: 'posts',
                    loadChildren: './+post/post.module#PostModule',
                },   
                {
                    path: 'products',
                    loadChildren: './+product/product.module#ProductModule',
                },   
                {
                    path: 'testimonials',
                    loadChildren: './+testimonial/testimonial.module#TestimonialModule',
                },   
                {
                    path: 'events',
                    loadChildren: './+event/event.module#EventModule',
                },
                {
                    path: 'virtual-run-events',
                    loadChildren: './+virtual-run-event/virtual-run-event.module#VirtualRunEventModule',
                },
                {
                    path: 'non-virtual-run-events',
                    loadChildren: './+non-virtual-run-event/non-virtual-run-event.module#NonVirtualRunEventModule',
                },  
                {
                    path: 'ck-image-browse',
                    component: CkImageBrowseComponent
                },
            ]
        }
    ])],
    exports: [RouterModule],
})
export class CPRoutingModule { }
