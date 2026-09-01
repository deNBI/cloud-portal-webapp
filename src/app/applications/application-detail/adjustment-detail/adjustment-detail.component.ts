import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { is_vo, lifescience_id } from '../../../shared/globalvar'

/**
 * Application informations.
 */
@Component({
	selector: 'app-adjustment-detail',
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './adjustment-detail.component.html'
})
export class AdjustmentDetailComponent implements OnInit {
	is_vo: boolean = is_vo
	@Input() comment: string
	lifescience_id: string = lifescience_id

	ngOnInit() {}
}
