import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router'

import { filter } from 'rxjs/operators'
import { NgClass } from '@angular/common'

// tslint:disable
@Component({
	selector: 'app-breadcrumbs',
	template: ` @for (breadcrumb of breadcrumbs; track breadcrumb; let last = $last) {
		@if (
			(breadcrumb.label.title && breadcrumb.url.substring(breadcrumb.url.length - 1) === '/') ||
			(breadcrumb.label.title && last)
		) {
			<li class="breadcrumb-item" [ngClass]="{ active: last }">
				@if (!last) {
					<a [routerLink]="breadcrumb.url">{{ breadcrumb.label.title }}</a>
				}
				@if (last) {
					<span [routerLink]="breadcrumb.url">{{ breadcrumb.label.title }}</span>
				}
			</li>
		}
	}`,
	imports: [NgClass, RouterLink]
})
export class BreadcrumbsComponent implements OnInit {
	breadcrumbs: object[]

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) {
		this.router = router
		this.route = route
	}

	ngOnInit(): void {
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
			this.breadcrumbs = []
			let currentRoute = this.route.root
			let url = ''
			do {
				const childrenRoutes = currentRoute.children
				currentRoute = null

				childrenRoutes.forEach(route => {
					if (route.outlet === 'primary') {
						const routeSnapshot = route.snapshot
						url += `/${routeSnapshot.url.map(segment => segment.path).join('/')}`
						this.breadcrumbs.push({
							label: route.snapshot.data,
							url
						})
						currentRoute = route
					}
				})
			} while (currentRoute)
		})
	}
}
