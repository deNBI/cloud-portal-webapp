import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../application.model/application.model';
import { is_vo, elixir_id } from '../../../shared/globalvar';

/**
 * Application informations.
 */
@Component({
	selector: 'app-adjustment-detail',
	templateUrl: './adjustment-detail.component.html',
})
export class AdjustmentDetailComponent implements OnInit {
	@Input() application: Application;
	is_vo: boolean = is_vo;
	elixir_id: string = elixir_id;

	ngOnInit() {

	}
}
