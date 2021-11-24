import { Component } from '@angular/core';
import { WIKI, CLOUD_MAIL, CLOUD_PORTAL_SUPPORT_MAIL, STATUS_LINK, SUPPORT_LINK, } from '../../links/links';

/**
 * Help component.
 */
@Component({
	selector: 'app-help',
	templateUrl: './help.component.html',
	providers: [],

})

export class HelpComponent {

	WIKI: string = WIKI;
	CLOUD_MAIL: string = CLOUD_MAIL;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	STATUS_LINK: string = STATUS_LINK;
	SUPPORT_LINK: string = SUPPORT_LINK;
	title: string = 'Help';

}
