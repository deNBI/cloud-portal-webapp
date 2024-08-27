import { AfterViewInit, ApplicationRef, Component, OnInit, ViewChild } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { VoService } from './api-connector/vo.service'
import { TitleService } from './title.service'

/**
 * App component.
 */
@Component({
	selector: 'body',
	templateUrl: 'app.component.html',
	providers: [VoService]
})
export class AppComponent implements AfterViewInit, OnInit {
	notificationModalTitle: string = 'Update available'
	notificationModalMessage: string =
		'A new update is available. Please reload the site to use the new version of the portal.'
	notificationModalType: string = 'info'

	@ViewChild('notificationModal', { static: true }) modal: ModalDirective

	constructor(
		private appRef: ApplicationRef,
		private titleService: TitleService
	) {
		/*   if (environment.production) {
			 const isStable = appRef.isStable.pipe(first(isStable => isStable === true));
			 const intervalTime = interval(60 * 1000);
			 const checkUpdatesInIntervall = concat(isStable, intervalTime);
			 checkUpdatesInIntervall.subscribe(() => this.swUpdate.checkForUpdate().then(() => {
				 this.swUpdate.available.subscribe(evt => {
					 this.openNotificationModal()

				 })
			 }))
		 } */
	}

	reloadSite(): void {
		window.location.reload()
	}

	ngOnInit(): void {
		this.titleService.init()
	}

	ngAfterViewInit(): void {}
}
