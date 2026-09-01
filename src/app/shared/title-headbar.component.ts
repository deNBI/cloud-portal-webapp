import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core'
import { UserService } from '../api-connector/user.service'
import { NgClass } from '@angular/common'

/**
 * Title headbar component.
 */
@Component({
	templateUrl: 'title-headbar.component.html',
	selector: 'app-title-headbar',
	providers: [UserService],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgClass]
})
export class TitleHeadbarComponent {
	private userService = inject(UserService)

	@Input() page_title: string
	@Input() navbar_minimized: boolean
	brand_logo: string = 'static/webapp/assets/img/denbi-logo-color.svg'
	brand_logo_minimized: string = 'static/webapp/assets/img/denbi-logo-minimized.svg'

	constructor() {
		const userService = this.userService

		this.userService = userService
	}

	logout(): void {
		this.userService.logoutUser().subscribe((redirect: any): void => {
			window.location.href = redirect['redirect']
		})
	}
}
