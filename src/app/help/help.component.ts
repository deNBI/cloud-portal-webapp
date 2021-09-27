import { Component } from '@angular/core';
import { WIKI, CLOUD_MAIL, CLOUD_PORTAL_SUPPORT_MAIL } from '../../links/links';

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
	title: string = 'Help';

}
