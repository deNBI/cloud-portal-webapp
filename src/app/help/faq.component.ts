import { Component, OnInit } from '@angular/core';
import {
	WIKI, CLOUD_MAIL, CLOUD_PORTAL_SUPPORT_MAIL, STATUS_LINK, SUPPORT_LINK,
} from '../../links/links';
import { is_vo } from '../shared/globalvar';

/**
 *FAQ component.
 */
@Component({
	selector: 'app-faq',
	templateUrl: './faq.component.html',
	providers: [],

})

export class FaqComponent implements OnInit {

	WIKI: string = WIKI;
	CLOUD_MAIL: string = CLOUD_MAIL;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	STATUS_LINK: string = STATUS_LINK;
	SUPPORT_LINK: string = SUPPORT_LINK;
	title: string = 'Frequently asked questions';
	is_vo_admin: boolean = false;

	ngOnInit(): void {
		this.is_vo_admin = is_vo;
	}
}
