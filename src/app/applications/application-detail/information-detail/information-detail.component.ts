import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../application.model/application.model';
import { global_event, is_vo } from '../../../shared/globalvar';

/**
 * Application informations.
 */
@Component({
	selector: 'app-information-detail',
	templateUrl: './information-detail.component.html',
})
export class InformationDetailComponent implements OnInit {
	@Input() application: Application;
	is_vo: boolean = is_vo;
	elixir_id: string = '';

	ngOnInit() {
		global_event.subscribe(
			(result: any) => {
				if ('elixir_id' in result) {
					this.elixir_id = result['elixir_id'];
				}
			},
		);
	}
}
