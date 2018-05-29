import { ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractResourceService, Entity, FormService, AbstractCPFormComponent } from '../../../../../stooges/src/public_api';

export interface ParentComponent<ResourceType> {
    resources: ResourceType[];
}

export abstract class AbstractSimplePutFormComponent<ResourceType extends Entity> extends AbstractCPFormComponent implements OnInit {

    constructor(
        cdr: ChangeDetectorRef,
        protected resourceService: AbstractResourceService<ResourceType>,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected edmFormService: FormService,
        protected parentComponent: ParentComponent<ResourceType>
    ) {
        super(cdr);
    }

    ready = false;
    backButtonRouterLink = ['../../'];
    formTitle = 'Edit';

    async ngOnInit() {
        const Id = +this.activatedRoute.snapshot.paramMap.get('Id')!;
        const resources = this.parentComponent.resources; 
        let resource = (resources) ? resources.find(d => d && d.Id == Id) : await this.resourceService.getAsync(Id);
        this.eGroup = this.edmFormService.buildFormEDM(resource);
        this.buildUniqueDisplayNames();
        this.form = this.edmFormService.buildNgForm(this.eGroup);
        this.ready = true;
        this.cdr.markForCheck();
    }

    protected async internalSubmitAsync(): Promise<boolean> {
        if (this.form.dirty) await this.resourceService.putAsync(this.form.value);
        this.router.navigate(this.backButtonRouterLink, { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
        return true;
    }

}

