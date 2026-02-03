import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Client } from '../client.model'
import { ClientService } from '../../../api-connector/client.service'
import { Application } from '../../../applications/application.model/application.model'
import { FacilityService } from '../../../api-connector/facility.service'
import { ConfirmationActions } from '../../../shared/modal/confirmation_actions'
import { NgStyle } from '@angular/common'

@Component({
	selector: 'app-client-limits',
	templateUrl: './client-limits.component.html',
	providers: [FacilityService, ClientService],
	imports: [NgStyle]
})
export class ClientLimitsComponent implements OnDestroy, OnInit {
	client: Client = null
	compute_center_id: string = null
	application: Application = null
	is_modification_request: boolean = false
	approvable: boolean = true
	limits_message: string
	message_type: string
	submitted: boolean = false
	request_failed: boolean = false
	public event: EventEmitter<any> = new EventEmitter()

	constructor(
		public bsModalRef: BsModalRef,
		private clientService: ClientService,
		private facilityService: FacilityService
	) {}

	getComputeCenterClientLimitsAvailable() {
		this.facilityService
			.getComputeCenterClientLimitsAvailable(this.compute_center_id, this.application.project_application_id.toString())
			.subscribe(
				(cl: any) => {
					this.client = new Client(null, null, null, cl['client_name'], null)
					this.client.setLimit(cl)
					if (cl['client_available']) {
						this.message_type = 'success'
						this.limits_message = `The client [${this.client.location}] has enough resources left!.`
						this.approvable = true
					} else {
						this.message_type = 'danger'
						this.limits_message = `The client [${this.client.location}] has not the necessary resources left!`
						// this.approvable = false;
					}
				},
				(error: object): void => {
					console.log(error)
					this.message_type = 'danger'
					this.limits_message = 'The connection to chosen client cannot be established!'
					this.request_failed = true
				}
			)
	}

	getClientLimits() {
		this.clientService.getClientLimits(this.client.id).subscribe(
			(cl: any) => {
				this.client = new Client(null, null, null, cl['client_name'], null)
				this.client.setLimit(cl)

				//	this.client.newRam = client['new_ram'];
			},
			(error: object): void => {
				console.log(error)
				this.message_type = 'danger'
				this.limits_message = 'The connection to chosen client cannot be established!'
				this.request_failed = true
			}
		)
	}

	approve(): void {
		this.submitted = true
		if (this.approvable && !this.is_modification_request) {
			this.createSimpleVM()
		}
		if (this.approvable && this.is_modification_request) {
			this.approveModification()
		}
	}

	approveModification(): void {
		this.event.emit({
			approveModification: true,
			application: this.application,
			action: ConfirmationActions.APPROVE_MODIFICATION
		})
		this.bsModalRef.hide()
	}

	createSimpleVM(): void {
		this.event.emit({
			createSimpleVM: true,
			compute_center_id: this.compute_center_id,
			application: this.application
		})
		this.bsModalRef.hide()
	}

	ngOnInit() {
		this.request_failed = false
		if (this.client) {
			this.getClientLimits()
		} else if (this.application && !this.compute_center_id) {
			this.message_type = 'warning'
			this.limits_message = 'Client will be scheduled via round robin!'
		} else if (this.application && !this.is_modification_request) {
			this.getComputeCenterClientLimitsAvailable()
		} else if (this.application && this.is_modification_request) {
			this.getComputeCenterClientLimitsAvailable()
		}
	}

	ngOnDestroy(): void {
		if (!this.submitted) {
			this.event.emit({
				closed: true
			})
		}
		this.bsModalRef.hide()
	}
}
