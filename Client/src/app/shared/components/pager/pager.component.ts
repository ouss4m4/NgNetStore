import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent {
  @Input() count!: number;
  @Input() pageSize!: number;
  @Output() pageChanged = new EventEmitter<number>();
  constructor() {}

  onPageChanged(event: any) {
    this.pageChanged.emit(event.page);
  }
}
