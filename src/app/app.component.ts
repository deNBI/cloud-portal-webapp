import { AfterViewInit, ApplicationRef, Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { VoService } from './api-connector/vo.service'
import { TitleService } from './title.service'
import { RouterOutlet } from '@angular/router'

/**
 * App component.
 */
@Component({
	selector: 'body',
	templateUrl: 'app.component.html',
	providers: [VoService],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [RouterOutlet]
})
export class AppComponent implements AfterViewInit, OnInit {
	private appRef = inject(ApplicationRef)
	private titleService = inject(TitleService)

	notificationModalTitle: string = 'Update available'
	notificationModalMessage: string =
		'A new update is available. Please reload the site to use the new version of the portal.'
	notificationModalType: string = 'info'

	reloadSite(): void {
		window.location.reload()
	}

	ngOnInit(): void {
		this.titleService.init()
	}

	ngAfterViewInit(): void {}
}
