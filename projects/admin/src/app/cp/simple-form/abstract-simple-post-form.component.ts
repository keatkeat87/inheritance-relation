import { ChangeDetectorRef, OnInit } from '@angular/core';
import { FormService, AbstractResourceService, Constructor, Entity, AbstractCPFormComponent } from '../../../../../stooges/src/public_api';

export abstract class AbstractSimplePostFormComponent<ResourceType extends Entity> extends AbstractCPFormComponent implements OnInit {

    protected resetOnSuccessful = true;

    constructor(
        cdr: ChangeDetectorRef,
        protected resourceService: AbstractResourceService<ResourceType>,
        protected edmFormService: FormService
    ) {
        super(cdr);
    }

    ready = true;
    backButtonRouterLink = ['../'];
    formTitle = 'Create';
    resourceConstructor: Constructor

    ngOnInit() {
        this.eGroup = this.edmFormService.buildFormEDM(new this.resourceConstructor());
        this.buildUniqueDisplayNames();
        this.form = this.edmFormService.buildNgForm(this.eGroup);
        this.defaultValue = this.form.value;
    }

    protected async internalSubmitAsync(): Promise<boolean> {
        await this.resourceService.postAsync(this.form.value);
        return true;
    }

}

