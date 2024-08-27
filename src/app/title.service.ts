import { Injectable } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router, NavigationEnd } from '@angular/router'
import { filter, map } from 'rxjs/operators'

@Injectable({
	providedIn: 'root'
})
export class TitleService {
	constructor(
		private title: Title,
		private router: Router
	) {}

	init() {
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd),
				map(() => this.router.routerState.root),
				map(route => {
					while (route.firstChild) route = route.firstChild

					return route
				}),
				map(route => route.snapshot.data['title'])
			)
			.subscribe((title: string) => {
				if (title) {
					this.title.setTitle(title)
					// Optionally, ensure Matomo gets the updated title
					if (window['_paq']) {
						window['_paq'].push(['setDocumentTitle', title])
					}
				}
			})
	}
}
