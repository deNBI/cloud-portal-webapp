import { Component, Input } from '@angular/core';
import { is_vo } from '../../../../globalvar';
import { Application } from '../../../../../applications/application.model/application.model';

@Component({
	selector: 'app-application-badges',
	templateUrl: './application-badges.component.html',
	styleUrls: ['./application-badges.component.scss'],
})
export class ApplicationBadgesComponent {
	@Input() application: Application;
	is_vo_admin: boolean = false;

	constructor() {
		this.is_vo_admin = is_vo;
	}
}
