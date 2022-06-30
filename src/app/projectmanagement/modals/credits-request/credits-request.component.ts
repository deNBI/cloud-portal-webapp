import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CreditsService } from '../../../api-connector/credits.service';
import { Application } from '../../../applications/application.model/application.model';
import { ApplicationCreditRequest } from '../../../applications/application_credit_request';
import { ResultComponent } from '../result/result.component';
import { Flavor } from '../../../virtualmachines/virtualmachinemodels/flavor';

@Component({
	selector: 'app-credits-request',
	templateUrl: './credits-request.component.html',
	styleUrls: ['./credits-request.component.scss'],
	providers: [CreditsService],
})
export class CreditsRequestComponent implements OnInit, OnDestroy {
	project: Application;
	temp_credits_extension: ApplicationCreditRequest;

	smallExamplePossibleHours: number;
	largeExamplePossibleHours: number;
	smallExamplePossibleDays: string;
	largeExamplePossibleDays: string;
	smallExampleFlavor: Flavor;
	largeExampleFlavor: Flavor;
	creditsPerHourSmallExample: number;
	creditsPerHourLargeExample: number;
	flavorList: Flavor[];

	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();
	submitted: boolean = false;

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private creditsService: CreditsService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		if (this.project.project_credit_request) {
			this.temp_credits_extension = new ApplicationCreditRequest(this.project.project_credit_request);
		} else {
			this.temp_credits_extension = new ApplicationCreditRequest();
			this.temp_credits_extension.setByApp(this.project);
		}

		this.initExampleFlavors();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		if (!this.submitted) {
			this.event.emit({ reload: false });
		}
	}

	updateExampleCredits(numberOfCredits: number): void {
		const totalHoursSmall: number = Math.round((numberOfCredits / this.creditsPerHourSmallExample) * 100) / 100;
		const totalHoursLarge: number = Math.round((numberOfCredits / this.creditsPerHourLargeExample) * 100) / 100;
		this.smallExamplePossibleHours = totalHoursSmall;
		this.largeExamplePossibleHours = totalHoursLarge;
		this.smallExamplePossibleDays = this.updateCreditsDaysString(totalHoursSmall);
		this.largeExamplePossibleDays = this.updateCreditsDaysString(totalHoursLarge);
	}

	updateCreditsDaysString(hours: number): string {
		let days: number = 0;
		const minutes: number = Math.floor((hours % 1) * 60);
		if (hours > 24) {
			days = Math.floor(hours / 24);
		}
		hours = Math.floor(hours % 24);

		return `${days} day(s), ${hours} hour(s) and ${minutes} minute(s)`;
	}

	initExampleFlavors(): void {
		const standardFlavors: Flavor[] = this.flavorList
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter((fl: Flavor, nu: number, arr: Flavor[]): boolean => fl.type.long_name === 'Standard Flavors');
		const highMemFlavors: Flavor[] = this.flavorList
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter((fl: Flavor, nu: number, arr: Flavor[]): boolean => fl.type.long_name === 'High Memory Flavors');
		standardFlavors.sort((fl1: Flavor, fl2: Flavor): number => fl1.vcpus - fl2.vcpus);
		highMemFlavors.sort((fl1: Flavor, fl2: Flavor): number => fl1.vcpus - fl2.vcpus);
		if (standardFlavors.length !== 0) {
			this.smallExampleFlavor = standardFlavors[0];
			this.creditsService
				.getCreditsPerHour(this.smallExampleFlavor.vcpus, this.smallExampleFlavor.ram_gib)
				.toPromise()
				.then((credits: number): void => {
					this.creditsPerHourSmallExample = credits * 4;
				})
				.catch((err: Error): void => console.log(err.message));
		}
		if (highMemFlavors.length !== 0) {
			this.largeExampleFlavor = highMemFlavors[0];
			this.creditsService
				.getCreditsPerHour(this.largeExampleFlavor.vcpus, this.largeExampleFlavor.ram_gib)
				.toPromise()
				.then((credits: number): void => {
					this.creditsPerHourLargeExample = credits;
				})
				.catch((err: Error): void => console.log(err.message));
		}
	}

	showSubmitModal(): void {
		const initialState = {
			project: this.project,
			extension: this.temp_credits_extension,
			creditsExtension: true,
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
