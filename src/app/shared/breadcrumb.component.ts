import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

// tslint:disable
@Component({
	selector: 'app-breadcrumbs',
	template: `
                 <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last=last>
                     <li class="breadcrumb-item"
                         *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) === '/'||breadcrumb.label.title&&last"
                         [ngClass]="{active: last}">
                         <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
                         <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
                     </li>
                 </ng-template>`,
})
export class BreadcrumbsComponent implements OnInit {
	breadcrumbs: Object[];

	constructor(private router: Router, private route: ActivatedRoute) {
		this.router = router;
		this.route = route;
	}

	ngOnInit(): void {
		this.router.events.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.breadcrumbs = [];
				let currentRoute = this.route.root;
				let url = '';
				do {
					const childrenRoutes = currentRoute.children;
					currentRoute = null;
					// eslint-disable-next-line no-loop-func
					childrenRoutes.forEach(route => {
						if (route.outlet === 'primary') {
							const routeSnapshot = route.snapshot;
							url += `/${routeSnapshot.url.map(segment => segment.path).join('/')}`;
							this.breadcrumbs.push({
								label: route.snapshot.data,
								url,
							});
							currentRoute = route;
						}
					});
				} while (currentRoute);
			});
	}
}
