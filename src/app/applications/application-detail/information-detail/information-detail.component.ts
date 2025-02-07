import { Component, Input, OnInit } from '@angular/core'
import { Application } from '../../application.model/application.model'
import { is_vo, elixir_id } from '../../../shared/globalvar'
import { environment } from '../../../../environments/environment'
import { NgFor, NgIf } from '@angular/common'

/**
 * Application informations.
 */
@Component({
	selector: 'app-information-detail',
	templateUrl: './information-detail.component.html',
	imports: [NgFor, NgIf]
})
export class InformationDetailComponent implements OnInit {
	@Input() application: Application
	is_vo: boolean = is_vo
	elixir_id: string = elixir_id

	environment: any = environment

	ngOnInit() {}
}
