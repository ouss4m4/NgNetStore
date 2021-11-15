import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent {
  breadCrumb$: Observable<any> = this.bcService.breadcrumbs$;
  constructor(private bcService: BreadcrumbService) {}
}
