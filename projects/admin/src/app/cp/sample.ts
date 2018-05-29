

/*
Table

image
<th style="width:200px">
    Image
</th>

<td>
    <img [sImage]="[data.image, 'upload']" />
</td>

----------------------------------------------------------------------------------------------------------

sort
<th style="width:20px"></th>

<tr *ngFor="let data of datas; let i=index;trackBy:trackById"
[ngClass]="{ onDrag : data === draggingData }"
[sDragover]="draggingData && !loading"
(dragenter)="draggingData && !loading && moveSort(data,i)">

<td [draggable]="sort == 'sort' && !loading"
    (dragstart)="recordDragStart(data)"
    (dragend)="draggingData && !loading && updateSort()">
    <i class="material-icons">more_vert</i>
</td>

----------------------------------------------------------------------------------------------------------

SQL Like
protected getResourcesStream(queryParams: QueryParams): Stream<ResourceType[]> {
    if (this.sort == 'date') {
      let desc = ((this.desc) ? ' desc' : '');
      queryParams['$orderby'] = `date${desc},Id${desc}`;
    }
    let search = this.activatedRoute.snapshot.queryParamMap.get('search');
    if (search) {
        queryParams['$filter'] = `contains(category/name_en,'${search}') or ` +
        `contains(category/name_cn,'${search}') or ` +
        `contains(title_en,'${search}') or ` +
        `contains(title_cn,'${search}') or ` +
        `contains(SKU,'${search}') or ` +
        `contains(summary_en,'${search}') or ` +
        `contains(summary_cn,'${search}') or ` +
        `contains(description_en,'${search}') or ` +
        `contains(description_cn,'${search}')`;

        let finalSearch = search;
        let firstChar = search.charAt(0);
        if(firstChar == '>' || firstChar == '<') finalSearch = search.substring(1);
        let operator = 'eq';
        if(firstChar == '>') operator = 'ge';
        if(firstChar == '<') operator = 'le';

        if (!isNaN(finalSearch as any)) {
            queryParams['$filter'] += ` or amount ${operator} ${finalSearch} or discountedAmount ${operator} ${finalSearch}`;
        }

        if (stooges.isValidDate(new Date(finalSearch))) {
            queryParams['$filter'] += ` or date ${ operator } ${new Date(finalSearch).toDateString()}`;
        }
    }
    queryParams['$select'] = 'Id,title_en,images,sort,category,SKU';
    queryParams['$expand'] = 'category';
    return this.resourceService.queryWatch(queryParams);
}

----------------------------------------------------------------------------------------------------------

order by expand
<th (click)="sortBy('category/name_en')"
    class="sort"
    style="width:200px">
    Category
    <i [sShow]="sort == 'category/name_en' && desc"
        class="material-icons">arrow_upward</i>
    <i [sShow]="sort == 'category/name_en' && !desc"
        class="material-icons">arrow_downward</i>
</th>

----------------------------------------------------------------------------------------------------------


*/

/*
Form

image
<s-mat-upload controlName="image"
    displayName="Upload image"></s-mat-upload>

----------------------------------------------------------------------------------------------------------

urltitle
<s-mat-input controlName="urlTitle"
    sUrlTitle="title"
    displayName="URL Title"></s-mat-input>

----------------------------------------------------------------------------------------------------------

toggle or bool
<s-mat-slide-toggle controlName="showInSceneNav"
    displayName="Show in scene nav"></s-mat-slide-toggle>



*/
