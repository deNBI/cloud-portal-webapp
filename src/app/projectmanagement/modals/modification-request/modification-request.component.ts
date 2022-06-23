import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ApplicationModification } from '../../../applications/application_modification.model';
import { ResultComponent } from '../result/result.component';
import { Application } from '../../../applications/application.model/application.model';
import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';
import { FlavorType } from '../../../virtualmachines/virtualmachinemodels/flavorType';
import { Flavor } from '../../../virtualmachines/virtualmachinemodels/flavor';
import { FlavorService } from '../../../api-connector/flavor.service';
import { CreditsService } from '../../../api-connector/credits.service';

@Component({
	selector: 'app-modification-request',
	templateUrl: './modification-request.component.html',
	styleUrls: ['./modification-request.component.scss'],
	providers: [FlavorService, CreditsService],
})
export class ModificationRequestComponent implements OnInit, OnDestroy {
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;

	project: Application;
	temp_project_modification: ApplicationModification;

	expected_total_credits: number = 0;
	flavorTypes: FlavorType[] = [];
	shown_flavors: { [name: string]: Flavor[] } = {};
	min_vm: boolean = true;

	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();
	submitted: boolean = false;

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private flavorService: FlavorService,
		private creditsService: CreditsService,
	) {
		// do nothing.
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		if (!this.submitted) {
			this.event.emit({ reload: false });
		}
	}

	ngOnInit(): void {
		if (this.project.project_modification_request) {
			this.temp_project_modification = new ApplicationModification(this.project.project_modification_request);
		} else {
			this.temp_project_modification = new ApplicationModification();
			this.temp_project_modification.setByApp(this.project);
		}
		this.subscription.add(
			this.flavorService.getListOfTypesAvailable().subscribe((result: FlavorType[]) => {
				this.flavorTypes = result;
				for (const flavorType of this.flavorTypes) {
					this.shown_flavors[flavorType.long_name] = [];
				}
				this.getFlavors();
			}),
		);
	}

	getFlavors(): void {
		this.subscription.add(
			this.flavorService
				.getListOfFlavorsAvailable(this.project.project_application_id.toString())
				.subscribe((flavors: Flavor[]): void => {
					this.temp_project_modification.flavors = [];
					for (const flavor of flavors) {
						if (this.project.project_application_openstack_project || flavor.simple_vm) {
							this.shown_flavors[flavor.type.long_name].push(flavor);
						}
					}
					this.checkFlavorDifferences();
				}),
		);
	}

	checkFlavorDifferences(): void {
		for (const flavor of this.project.flavors) {
			const idx: number = this.shown_flavors[flavor.type.long_name].findIndex(
				(fl: Flavor): boolean => fl.name === flavor.name,
			);
			// not in shown_flavors, so flavor only for project
			if (idx < 0) {
				const disabled_flavor: Flavor = new Flavor(flavor);
				disabled_flavor.setDisabled(true);
				const mod_flavor: Flavor = new Flavor(flavor);
				this.shown_flavors[flavor.type.long_name].push(disabled_flavor);
				this.shown_flavors[flavor.type.long_name].push(mod_flavor);
				this.temp_project_modification.flavors.push(mod_flavor);
			} else {
				// else in shown_flavors, may be different than old one
				this.shown_flavors[flavor.type.long_name][idx].counter = flavor.counter;
				const mod_flavor: Flavor = new Flavor(this.shown_flavors[flavor.type.long_name][idx]);
				this.temp_project_modification.flavors.push(mod_flavor);
				this.shown_flavors[flavor.type.long_name].splice(idx, 0, flavor);
				this.shown_flavors[flavor.type.long_name][idx].setDisabled(true);
			}
		}
		this.temp_project_modification.calculateRamCores();
	}

	checkFlavorPairs(flavor: Flavor, event: any): void {
		const amount: number = Number(event.target.value);
		const idx: number = this.temp_project_modification.flavors.findIndex(
			(fl: Flavor): boolean => fl.name === flavor.name,
		);
		if (idx >= 0) {
			this.temp_project_modification.flavors.splice(idx, 1);
			if (amount > 0) {
				flavor.counter = amount;
				this.temp_project_modification.flavors.push(flavor);
			}
		} else if (amount > 0) {
			flavor.counter = amount;
			this.temp_project_modification.flavors.push(flavor);
		}
		this.min_vm =			this.project.project_application_openstack_project || this.temp_project_modification.flavors.length > 0;
		this.temp_project_modification.calculateRamCores();
		this.getExtraCredits();
	}

	getExtraCredits(): void {
		if (!this.project.credits_allowed) {
			return;
		}

		this.subscription.add(
			this.creditsService
				.getExtraCreditsForResourceExtension(
					this.temp_project_modification.flavors,
					this.project.project_application_id.toString(),
				)
				.subscribe((credits: number): void => {
					this.temp_project_modification.extra_credits = credits;
					this.expected_total_credits =						this.project.project_application_initial_credits + this.temp_project_modification.extra_credits;
					if (this.expected_total_credits <= 0) {
						this.expected_total_credits = 0;
					}
				}),
		);
	}

	showSubmitModal(): void {
		const initialState = {
			project: this.project,
			extension: this.temp_project_modification,
			modificationExtension: true,
			expectedTotalCredits: this.expected_total_credits,
		};
		this.submitted = true;
		this.bsModalRef = this.modalService.show(ResultComponent, { initialState });
		this.bsModalRef.setClass('modal-lg');
		this.bsModalRef.content.event.subscribe((result: any) => {
			if ('reload' in result && result['reload']) {
				this.event.emit({ reload: true });
			} else {
				this.event.emit({ reload: false });
			}
		});
	}
}
