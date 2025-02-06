import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Application } from '../../../applications/application.model/application.model'
import { ApplicationLifetimeExtension } from '../../../applications/application_extension.model'
import { CreditsService } from '../../../api-connector/credits.service'
import { EdamOntologyTerm } from '../../../applications/edam-ontology-term'
import { ResultComponent } from '../result/result.component'
import { ApplicationsService } from '../../../api-connector/applications.service'

@Component({
	selector: 'app-lifetime-request',
	templateUrl: './lifetime-request.component.html',
	styleUrls: ['./lifetime-request.component.scss'],
	providers: [CreditsService, ApplicationsService],
	standalone: false
})
export class LifetimeRequestComponent implements OnInit, OnDestroy {
	project: Application
	temp_project_extension: ApplicationLifetimeExtension
	initial_number_of_edam_terms: number = 0

	life_time_string: string
	end_date: Date
	new_end_date: Date | string
	MAX_LIFETIME_DEFAULT: number = 6
	max_lifetime: number = this.MAX_LIFETIME_DEFAULT
	selected_ontology_terms: EdamOntologyTerm[] = []
	edam_ontology_terms: EdamOntologyTerm[]
	ontology_search_keyword: string = 'term'

	private subscription: Subscription = new Subscription()
	public event: EventEmitter<any> = new EventEmitter()
	submitted: boolean = false

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private creditsService: CreditsService,
		private applicationsService: ApplicationsService
	) {}

	ngOnInit(): void {
		this.applicationsService.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]): void => {
			this.edam_ontology_terms = terms
			this.searchTermsInEdamTerms()
		})
		if (this.project.project_application_nfdi?.length > 0) {
			this.max_lifetime = 12
		} else {
			this.max_lifetime = this.MAX_LIFETIME_DEFAULT
		}
		if (this.project.project_lifetime_request) {
			this.temp_project_extension = new ApplicationLifetimeExtension(this.project.project_lifetime_request)
		} else {
			this.temp_project_extension = new ApplicationLifetimeExtension()
			this.temp_project_extension.setByApp(this.project)
		}
		const endDateInfo = this.life_time_string ? this.life_time_string.split(' - ')[1]?.split('.') : []
		if (endDateInfo.length === 3) {
			const [day, month, year] = endDateInfo.map(item => Number(item))
			if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
				this.end_date = new Date(year, month - 1, day)
			}
		}
		this.initial_number_of_edam_terms = this.project.project_application_edam_terms.length
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
		if (!this.submitted) {
			this.event.emit({ reload: false })
		}
	}

	searchTermsInEdamTerms(): void {
		const tmp: EdamOntologyTerm[] = []
		this.selected_ontology_terms.forEach((ele: any) => {
			// @ts-ignore
			const td = this.edam_ontology_terms.find(term => term.term === ele)
			tmp.push(td)
		})
		this.selected_ontology_terms = tmp
	}

	removeEDAMterm(term: EdamOntologyTerm): void {
		const indexOf: number = this.selected_ontology_terms.indexOf(term)
		this.selected_ontology_terms.splice(indexOf, 1)
	}

	showSubmitModal(): void {
		const initialState = {
			project: this.project,
			extension: this.temp_project_extension,
			lifetimeExtension: true,
			expectedTotalCredits:
				this.project.project_application_initial_credits + this.temp_project_extension.extra_credits,
			selected_ontology_terms: this.selected_ontology_terms
		}
		this.submitted = true
		this.bsModalRef = this.modalService.show(ResultComponent, { initialState })
		this.bsModalRef.setClass('modal-lg')
		this.bsModalRef.content.event.subscribe((result: any) => {
			if ('reload' in result && result['reload']) {
				if (this.selected_ontology_terms.length > 0) {
					this.applicationsService
						.addEdamOntologyTerms(this.project.project_application_id, this.selected_ontology_terms)
						.subscribe((): void => {
							this.event.emit({ reload: true })
						})
				} else {
					this.event.emit({ reload: true })
				}
			} else {
				this.event.emit({ reload: false })
			}
		})
	}

	isDate(dateToCheck: Date | string) {
		return typeof dateToCheck === 'object'
	}
	calculateNewEndDate() {
		if (this.end_date < new Date()) {
			this.new_end_date = `${this.temp_project_extension.extra_lifetime} month${
				this.temp_project_extension.extra_lifetime > 1 ? 's' : ''
			} after the approval of the extension`
		} else {
			this.new_end_date = new Date(this.end_date)
			const month_number: number = this.end_date.getMonth() + this.temp_project_extension.extra_lifetime
			this.new_end_date.setMonth(month_number % 12)
			if (month_number > 11) {
				this.new_end_date.setFullYear(this.new_end_date.getFullYear() + 1)
			}
		}
	}

	calculateCreditsLifetime(): void {
		if (!this.project.credits_allowed) {
			return
		}
		if (
			this.temp_project_extension.extra_lifetime <= 0 ||
			!Number.isInteger(this.temp_project_extension.extra_lifetime)
		) {
			this.temp_project_extension.extra_credits = 0

			return
		}
		this.subscription.add(
			this.creditsService
				.getExtraCreditsForLifetimeExtension(
					this.temp_project_extension.extra_lifetime,
					this.project.project_application_id.toString()
				)
				.subscribe((credits: number): void => {
					this.temp_project_extension.extra_credits = credits
				})
		)
	}
}
