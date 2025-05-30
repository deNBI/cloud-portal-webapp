import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { Application } from '../../../applications/application.model/application.model'
import { ApplicationModification } from '../../../applications/application_modification.model'
import { ApplicationLifetimeExtension } from '../../../applications/application_extension.model'
import { ApplicationCreditRequest } from '../../../applications/application_credit_request'
import { ApplicationsService } from '../../../api-connector/applications.service'
import { EdamOntologyTerm } from '../../../applications/edam-ontology-term'
import { NgIf, NgFor } from '@angular/common'
import { AlertModule } from 'ngx-bootstrap/alert'

@Component({
	selector: 'app-result',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss'],
	providers: [ApplicationsService, BsModalService],
	imports: [NgIf, NgFor, AlertModule]
})
export class ResultComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription()
	public event: EventEmitter<any> = new EventEmitter()
	submit: boolean = true
	result: boolean = false

	project: Application
	extension: ApplicationModification | ApplicationLifetimeExtension | ApplicationCreditRequest
	adjustedModification: ApplicationModification

	lifetimeExtension: boolean = false
	modificationExtension: boolean = false
	creditsExtension: boolean = false

	expectedTotalCredits: number = 0
	extensionStatus: number = 0
	selected_ontology_terms: EdamOntologyTerm[]

	errorMessage: any

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private applicationsService: ApplicationsService
	) {}

	ngOnInit(): void {
		this.setToSubmitState()
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
		if (!this.result) {
			this.event.emit({ reload: false })
		}
	}

	chainDataInput(): void {
		this.event.emit({ enterData: true })
	}

	submitModificationRequest(): void {
		this.setToResultState()

		this.subscription.add(
			this.applicationsService.requestModification(this.extension as ApplicationModification).subscribe(
				(result: { [key: string]: string }): void => {
					if (result['Error']) {
						this.extensionStatus = 2
						this.errorMessage = result['Error']
					} else {
						this.extensionStatus = 1
					}

					this.event.emit({ reload: true })
				},
				() => {
					this.extensionStatus = 2
					this.errorMessage =
						'Submitting the modification request was not successful. Please reload this page and try again!'
				}
			)
		)
	}

	submitModificationAdjustment(): void {
		this.setToResultState()
		this.subscription.add(
			this.applicationsService.adjustModification(this.adjustedModification).subscribe(
				(): void => {
					this.extensionStatus = 5
					this.event.emit({ reload: true })
				},
				(): void => {
					this.extensionStatus = 2
					this.errorMessage = 'An error occurred submitting the modification adjustment.'
				}
			)
		)
	}

	submitLifetimeExtensionRequest(): void {
		this.setToResultState()

		this.applicationsService.requestAdditionalLifetime(this.extension as ApplicationLifetimeExtension).subscribe(
			(result: { [key: string]: string }): void => {
				if (result['Error']) {
					this.extensionStatus = 2
					this.errorMessage = result['Error']
				} else {
					this.extensionStatus = 1
				}

				this.event.emit({ reload: true })
			},
			() => {
				this.extensionStatus = 2
				this.errorMessage =
					'Submitting the extension request was not successful. Please reload this page and try again!'
			}
		)
	}

	submitCreditsModification(): void {
		this.setToResultState()

		this.subscription.add(
			this.applicationsService.requestAdditionalCredits(this.extension as ApplicationCreditRequest).subscribe(
				(result: { [key: string]: string }): void => {
					if (result['Error']) {
						this.extensionStatus = 2
					} else {
						this.extensionStatus = 1
					}
					this.event.emit({ reload: true })
				},
				() => {
					this.extensionStatus = 2
					this.errorMessage = 'Submitting the credit request was not successful. Please reload this page and try again!'
				}
			)
		)
	}

	setToResultState(): void {
		this.submit = false
		this.result = true
	}

	setToSubmitState(): void {
		this.submit = true
		this.result = false
	}
}
