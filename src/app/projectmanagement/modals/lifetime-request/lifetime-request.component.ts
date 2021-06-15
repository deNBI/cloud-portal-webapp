import {
	Component, EventEmitter, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
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

	life_time_string: string;

	selected_ontology_terms: EdamOntologyTerm[] = [];
	edam_ontology_terms: EdamOntologyTerm[];
	ontology_search_keyword: string = 'term';
	@ViewChild('edam_ontology') edam_ontology: AutocompleteComponent;

	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private creditsService: CreditsService,
		private applicationsService: ApplicationsService,
		// eslint-disable-next-line no-empty-function
	) {}

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
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
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

	selectEvent(item: any): void {
		if (this.selected_ontology_terms.indexOf(item) === -1) {
			this.selected_ontology_terms.push(item);
		}
		this.edam_ontology.clear();
	}

	showSubmitModal(): void {
		const initialState = {
			project: this.project,
			extension: this.temp_project_extension,
			lifetimeExtension: true,
		};
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

}
