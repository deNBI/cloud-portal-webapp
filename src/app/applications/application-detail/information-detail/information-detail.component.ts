import { Component, Input, OnInit } from '@angular/core'
import { Application } from '../../application.model/application.model'
import { is_vo, lifescience_id } from '../../../shared/globalvar'
import { environment } from '../../../../environments/environment'
import { NgClass } from '@angular/common'
import { AllowedDisseminationInformationPipe } from 'app/pipe-module/pipes/allowed-dissemination-information.pipe'

/**
 * Application informations.
 */
@Component({
	selector: 'app-information-detail',
	templateUrl: './information-detail.component.html',
	imports: [NgClass, AllowedDisseminationInformationPipe]
})
export class InformationDetailComponent implements OnInit {
	@Input() application: Application
	is_vo: boolean = is_vo
	lifescience_id: string = lifescience_id

	environment: any = environment

	ngOnInit() {}
}
