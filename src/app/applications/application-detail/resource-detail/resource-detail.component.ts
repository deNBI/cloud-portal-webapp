import { Component, Input, OnInit } from '@angular/core';
import { green } from 'audit-ci/dist/colors';
import { Application } from '../../application.model/application.model';
import { User } from '../../application.model/user.model';
import { ApplicationBaseClassComponent } from '../../../shared/shared_modules/baseClass/application-base-class.component';
import { Flavor } from '../../../virtualmachines/virtualmachinemodels/flavor';

interface FlavorDiff {
	name: string
	current: number
	diff: number
	new: number
}

/**
 * Application Resource Details.
 */
@Component({
	selector: 'app-resource-detail',
	templateUrl: './resource-detail.component.html',
})
export class ResourceDetailComponent extends ApplicationBaseClassComponent implements OnInit {
	@Input() application: Application;
	@Input() is_vo_admin: boolean;
	@Input() current_credits: number;
	protected readonly Math = Math;
	protected readonly green = green;
	flavorDiffs: FlavorDiff[] = [];

	ngOnInit() {
		this.getFlavorChanges();
		this.getModificationRequestingUser();
	}

	getModificationRequestingUser() {
		if (this.application.project_modification_request && !this.application.project_modification_request.user) {
			this.applicationsService.getModificationUser(this.application.project_application_id).subscribe((user: User) => {
				this.application.project_modification_request.user = user;
			});
		}
	}

	getFlavorChanges() {
		this.flavorDiffs = [];

		// Initialize flavorDiffs with current flavors
		this.application.flavors.forEach((flavor: Flavor) => {
			this.flavorDiffs.push({
				name: flavor.name,
				current: flavor.counter,
				diff: 0,
				new: 0,
			});
		});

		// Iterate over modification request flavors
		if (this.application.project_modification_request) {
			this.application.project_modification_request.flavors.forEach((modificationFlavor: Flavor) => {
				const existingFlavorDiffIndex = this.flavorDiffs.findIndex(
					flavorDiff => flavorDiff.name === modificationFlavor.name,
				);

				if (existingFlavorDiffIndex !== -1) {
					// Flavor diff with same name exists
					const existingFlavorDiff = this.flavorDiffs[existingFlavorDiffIndex];
					existingFlavorDiff.new = modificationFlavor.counter;
					existingFlavorDiff.diff = existingFlavorDiff.new - existingFlavorDiff.current;
				} else {
					// Flavor diff with same name does not exist, add new flavor diff
					this.flavorDiffs.push({
						name: modificationFlavor.name,
						current: 0, // Set current as 0 as it's not present in the application flavors
						diff: modificationFlavor.counter,
						new: modificationFlavor.counter,
					});
				}
			});
		}
	}
}
