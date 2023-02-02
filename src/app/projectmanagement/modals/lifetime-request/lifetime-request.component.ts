import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Application } from '../../../applications/application.model/application.model';
import { ApplicationLifetimeExtension } from '../../../applications/application_extension.model';
import { CreditsService } from '../../../api-connector/credits.service';
import { EdamOntologyTerm } from '../../../applications/edam-ontology-term';
import { ResultComponent } from '../result/result.component';
import { ApplicationsService } from '../../../api-connector/applications.service';

@Component({
	selector: 'app-lifetime-request',
	templateUrl: './lifetime-request.component.html',
	styleUrls: ['./lifetime-request.component.scss'],
	providers: [CreditsService, ApplicationsService],
})
export class LifetimeRequestComponent implements OnInit, OnDestroy {

	project: Application;
	temp_project_extension: ApplicationLifetimeExtension;
	initial_number_of_edam_terms: number = 0;

	life_time_string: string;
	end_date: Date;
	new_end_date: Date;
	max_lifetime: number = 6;
	selected_ontology_terms: EdamOntologyTerm[] = [];
	edam_ontology_terms: EdamOntologyTerm[];
	ontology_search_keyword: string = 'term';

	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();
	submitted: boolean = false;

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private creditsService: CreditsService,
		private applicationsService: ApplicationsService,
		// eslint-disable-next-line no-empty-function
	) {
	}

	ngOnInit(): void {
		this.applicationsService.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]): void => {
			this.edam_ontology_terms = terms;
			this.searchTermsInEdamTerms();
		});

		if (this.project.project_lifetime_request) {
			this.temp_project_extension = new ApplicationLifetimeExtension(this.project.project_lifetime_request);
		} else {
			this.temp_project_extension = new ApplicationLifetimeExtension();
			this.temp_project_extension.setByApp(this.project);
		}
		// eslint-disable-next-line no-unsafe-optional-chaining
		const end_date_info = (this.life_time_string?.split(' - ')[1]).split('.') ?? [];
		if (end_date_info.length === 3) {
			this.end_date = new Date(Number(end_date_info[2]), Number(end_date_info[1]) - 1, Number(end_date_info[0]));
		}
		this.initial_number_of_edam_terms = this.project.project_application_edam_terms.length;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		if (!this.submitted) {
			this.event.emit({ reload: false });
		}
	}

	calculateCreditsLifetime(): void {
		if (!this.project.credits_allowed) {
			return;
		}
		if (this.temp_project_extension.extra_lifetime <= 0
			|| !Number.isInteger(this.temp_project_extension.extra_lifetime)) {
			this.temp_project_extension.extra_credits = 0;

			return;
		}
		this.subscription.add(
			this.creditsService.getExtraCreditsForLifetimeExtension(
				this.temp_project_extension.extra_lifetime,
				this.project.project_application_id.toString(),
			).subscribe(
				(credits: number): void => {
					this.temp_project_extension.extra_credits = credits;
				},
			),
		);
	}

	searchTermsInEdamTerms(): void {
		const tmp: EdamOntologyTerm[] = [];
		this.selected_ontology_terms.forEach(ele => {
			// @ts-ignore
			const td = this.edam_ontology_terms.find(term => term.term === ele);
			tmp.push(td);
		});
		this.selected_ontology_terms = tmp;
	}

	removeEDAMterm(term: EdamOntologyTerm): void {
		const indexOf: number = this.selected_ontology_terms.indexOf(term);
		this.selected_ontology_terms.splice(indexOf, 1);
	}

	showSubmitModal(): void {
		const initialState = {
			project: this.project,
			extension: this.temp_project_extension,
			lifetimeExtension: true,
			expectedTotalCredits: (this.project.project_application_initial_credits + this.temp_project_extension.extra_credits),
			selected_ontology_terms: this.selected_ontology_terms,
		};
		this.submitted = true;
		this.bsModalRef = this.modalService.show(ResultComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.bsModalRef.content.event.subscribe(
			(result: any) => {
				if ('reload' in result && result['reload']) {
					if (this.selected_ontology_terms.length > 0) {
						this.applicationsService
							.addEdamOntologyTerms(
								this.project.project_application_id,
								this.selected_ontology_terms,
							)
							.subscribe((): void => {
								this.event.emit({ reload: true });
							});
					} else {
						this.event.emit({ reload: true });
					}
				} else {
					this.event.emit({ reload: false });
				}
			},
		);
	}
	// TODO: Fix - end date still not showing correctly when entry is done with keys.
	calculateNewEndDate() {
		this.new_end_date = new Date(this.end_date);
		console.log(this.end_date);
		console.log(this.end_date.getMonth())
		this.new_end_date.setMonth(this.end_date.getMonth() + this.temp_project_extension.extra_lifetime);
		console.log(this.new_end_date);
	}
}
