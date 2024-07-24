import { Component, Input, OnInit } from '@angular/core';
import { is_vo, elixir_id } from '../../../shared/globalvar';

/**
 * Application informations.
 */
@Component({
	selector: 'app-adjustment-detail',
	templateUrl: './adjustment-detail.component.html',
})
export class AdjustmentDetailComponent implements OnInit {
	is_vo: boolean = is_vo;
	@Input() comment: string;
	elixir_id: string = elixir_id;

	ngOnInit() {}
}
