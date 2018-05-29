import { Input, OnInit } from '@angular/core';
import { range } from '../../common/methods/range';
/*
    sample :
    <s-pagination [rowPerPage]="rowPerPage" [totalRow]="totalRow" [page]="page"></s-pagination>
*/

export class AbstractPaginationComponent implements OnInit {
    constructor(
    ) { }

    ngOnInit() {

    }

    @Input()
    page: number;

    @Input()
    rowPerPage: number;

    @Input()
    totalRow: number;

    get lastPage(): number {
        return Math.ceil((this.totalRow / this.rowPerPage)); //round up
    }

    range(start: number, count: number): number[] {
        return range(start, count);
    }

}
