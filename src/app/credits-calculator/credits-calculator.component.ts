import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FacilityService } from '../api-connector/facility.service';
import { FlavorService } from '../api-connector/flavor.service';
import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor';
import { FlavorType } from '../virtualmachines/virtualmachinemodels/flavorType';
import { CreditsService } from '../api-connector/credits.service';
import {
	integerValidator,
	minAmountValidator,
} from '../applications/numberValidations.directive';
import { CREDITS_WIKI, CLOUD_PORTAL_SUPPORT_MAIL } from '../../links/links';

@Component({
	selector: 'app-credits-calculator',
	templateUrl: './credits-calculator.component.html',
	styleUrls: ['./credits-calculator.component.scss'],
	providers: [FacilityService, FlavorService, CreditsService],
})
export class CreditsCalculatorComponent implements OnInit {

	title: string = 'Credits Calculator';
	got_all_cc: boolean = false;
	got_all_flavor: boolean = false;
	selected_facility: [string, number];
	all_facilities: [string, number][] = [];
	flavor_types: FlavorType[] = [];
	all_flavors: Flavor[] = [];
	shown_flavors: { [name: string]: Flavor[] } = {};
	chosen_flavors: [string, number][] = [];

	credits_needed: number = 0;
	hours_possible: number = 0;

	total_cost_per_hour_needed: number = 0;
	total_cost_per_hour_time: number = 0;

	CREDITS_WIKI: string = CREDITS_WIKI;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;

	timestamp_group: FormGroup = new FormGroup(
		{
			date_picker: new FormControl(new Date()),
		},
	)

	credits_wanted_group: FormGroup = new FormGroup(
		{
			credits_wanted_form: new FormControl(1, [integerValidator, minAmountValidator(1)]),
		},
	);

	hours_wanted_group: FormGroup = new FormGroup(
		{
			hours_wanted_form: new FormControl(1, [integerValidator, minAmountValidator(1)]),
		},
	);

	constructor(private facility_service: FacilityService,
							private flavor_service: FlavorService,
							private credits_service: CreditsService) {
		// Empty comment for ESLint
	}

	ngOnInit(): void {
		this.flavor_service.getListOfTypesAvailable().subscribe(
			(result: FlavorType[]) => {
				this.flavor_types = result;
			},
		);
		this.all_facilities.push(['Default', null]);
		this.facility_service.getComputeCenters().subscribe(
			(result: any) => {
				for (const facility of result) {
					this.all_facilities.push([facility['compute_center_name'], facility['id']]);
				}
				this.selected_facility = this.all_facilities[0];
				this.got_all_cc = true;
				this.reload_data();
			},
			(error: any) => {
				console.log(error);
			},
		);
	}

	reload_data(): void {
		this.got_all_flavor = false;
		this.reset_data();
		this.flavor_service.getAllFlavors().subscribe(
			(result: any) => {
				this.all_flavors = result;
				for (const flavor of this.all_flavors) {
					if (flavor.type.long_name in this.shown_flavors
							&& flavor['public']) {
						this.shown_flavors[flavor.type.long_name].push(flavor);
					}
				}
				this.filter_flavors_by_facility();
				this.sort_by_cph();
				this.got_all_flavor = true;
			},
			(error: any) => {
				console.log(error);
			},
		);
	}

	reset_data(): void {
		this.all_flavors = [];
		for (const flavor_type of this.flavor_types) {
			this.shown_flavors[flavor_type.long_name] = [];
		}
		this.chosen_flavors = [];
		this.credits_wanted_group.get('credits_wanted_form').setValue(1);
		this.hours_wanted_group.get('hours_wanted_form').setValue(1);
		this.credits_needed = 0;
		this.hours_possible = 0;
		this.total_cost_per_hour_needed = 0;
		this.total_cost_per_hour_time = 0;
		this.timestamp_group.get('date_picker').setValue(new Date());
	}

	filter_flavors_by_facility(): void {
		if (this.selected_facility[1] === -1) {
			return;
		}
		for (const flavor of this.all_flavors) {
			let changed: boolean = false;
			if (flavor['compute_center'] !== this.selected_facility[1]) {
				continue;
			}
			for (const flavor_type in this.shown_flavors) {
				for (const shown_flavor of this.shown_flavors[flavor_type]) {
					if (shown_flavor.name === flavor.name) {
						this.shown_flavors[flavor_type][
							this.shown_flavors[flavor_type].indexOf(shown_flavor)
						] = flavor;
						changed = true;
					}
				}
			}
			if (!changed) {
				if (flavor.type.long_name in this.shown_flavors) {
					this.shown_flavors[flavor.type.long_name].push(flavor);
				} else {
					this.shown_flavors[flavor.type.long_name] = [flavor];
				}
			}
		}
	}

	sort_by_cph(): void {
		for (const flavor_type in this.shown_flavors) {
			this.shown_flavors[flavor_type].sort(
				(a, b)	=>	(a['credits_costs_per_hour'] < b['credits_costs_per_hour'] ? -1 : 1),
			);
		}
	}

	change_flavor_pair(name: string, event: any): void {
		const amount: number = Number(event.target.value);
		this.chosen_flavors.forEach((item, index) => {
			if (item.indexOf(name) > -1) this.chosen_flavors.splice(index, 1);
		});
		if (amount <= 0) return;
		this.chosen_flavors.push([name, amount]);
	}

	calculate_timestamp(): number {
		const date: Date = this.timestamp_group.get('date_picker').value;
		const date_time: Date = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		);

		return date_time.getTime() / 1000;
	}

	calculate_credits_needed(): void {
		this.credits_service.getPublicCreditsNeeded(
			this.hours_wanted_group.get('hours_wanted_form').value,
			this.chosen_flavors,
			this.selected_facility[0],
			this.calculate_timestamp(),
		).subscribe(
			(result: any) => {
				this.credits_needed = result['credits_needed'];
				this.total_cost_per_hour_needed = result['cost_per_hour'];
			},
		);
	}

	calculate_time_possible(): void {
		this.credits_service.getPublicHoursPossible(
			this.credits_wanted_group.get('credits_wanted_form').value,
			this.chosen_flavors,
			this.selected_facility[0],
			this.calculate_timestamp(),
		).subscribe(
			(result: any) => {
				this.hours_possible = result['max_hours'];
				this.total_cost_per_hour_time = result['cost_per_hour'];
			},
		);
	}

}
