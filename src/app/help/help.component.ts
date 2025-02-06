import { Component, OnInit } from '@angular/core'

import { WIKI, CLOUD_PORTAL_SUPPORT_MAIL, STATUS_LINK, SUPPORT_LINK, ZAMMAD_HELPDESK_LINK } from '../../links/links'
/**
 * Help component.
 */
@Component({
	selector: 'app-help',
	templateUrl: './help.component.html',
	providers: [],
	standalone: false
})
export class HelpComponent implements OnInit {
	WIKI: string = WIKI
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL
	STATUS_LINK: string = STATUS_LINK
	SUPPORT_LINK: string = SUPPORT_LINK
	ZAMMAD_HELPDESK_LINK: string = ZAMMAD_HELPDESK_LINK
	title: string = 'Help'

	ngOnInit(): void {}
}
