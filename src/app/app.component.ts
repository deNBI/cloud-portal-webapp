import {
	AfterViewInit, ApplicationRef, Component, OnInit, ViewChild,
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Angulartics2Matomo } from 'angulartics2';
import { VoService } from './api-connector/vo.service';

/**
 * App component.
 */
@Component({
	selector: 'body',
	templateUrl: 'app.component.html',
	providers: [VoService],
})
export class AppComponent implements AfterViewInit, OnInit {
	notificationModalTitle: string = 'Update available';
	notificationModalMessage: string =		'A new update is available. Please reload the site to use the new version of the portal.';
	notificationModalType: string = 'info';

	@ViewChild('notificationModal', { static: true }) modal: ModalDirective;

	constructor(
		private appRef: ApplicationRef,
		private angulartics2Matomo: Angulartics2Matomo,
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
		window.location.reload();
	}

	ngOnInit(): void {
		this.angulartics2Matomo.startTracking();
		// this.voService.isVo().subscribe((result: IResponseTemplate) => {
		// setVO(<boolean><Boolean>result.value);
		// })
	}

	ngAfterViewInit(): void {}
}
