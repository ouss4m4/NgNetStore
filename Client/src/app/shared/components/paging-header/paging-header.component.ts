import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss'],
})
export class PagingHeaderComponent {
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() count!: number;
  constructor() {}

  getVisibleNumber(): string {
    if (this.count === 0) {
      return `No result for current filter`;
    }
    const start = (this.pageIndex - 1) * this.pageSize + 1;
    const end =
      this.pageIndex * this.pageSize > this.count
        ? this.count
        : this.pageIndex * this.pageSize;
    return `${start} - ${end}`;
  }
}
