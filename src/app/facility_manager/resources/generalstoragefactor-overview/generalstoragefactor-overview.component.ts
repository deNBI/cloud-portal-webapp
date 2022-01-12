import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { FacilityService } from '../../../api-connector/facility.service';
import { GeneralStorageFactor } from '../general-storage-factor';

/**
 * Class for GeneralStorageFactor.
 */
@Component({
	selector: 'app-generalstoragefactor-overview',
	templateUrl: './generalstoragefactor-overview.component.html',
	providers: [FacilityService],

})
export class GeneralstoragefactorOverviewComponent implements OnInit {
	generalStorageFactors: GeneralStorageFactor[];
	@Input() facility_id: number;
	@Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

	newFactor: GeneralStorageFactor;
	storageUpdateList: { [id: string]: boolean } = {};

	constructor(private facilityService: FacilityService) {
		this.facilityService = facilityService;
	}

	ngOnInit(): void {
		this.getGeneralStorageFactors();
		this.newFactor = new GeneralStorageFactor(null);

	}

	getGeneralStorageFactors(): void {
		this.facilityService.getGeneralStorageFactors(this.facility_id).subscribe((res: GeneralStorageFactor[]): void => {
			this.generalStorageFactors = res;
			this.generalStorageFactors.sort((a_factor: GeneralStorageFactor, b_factor: GeneralStorageFactor): number => {
				if (a_factor.storage > b_factor.storage) {
					return 1;
				} else if (a_factor.storage === b_factor.storage) {
					return 0;
				} else {
					return -1;
				}

			});
			this.generalStorageFactors.forEach((vF: GeneralStorageFactor): void => {
				this.storageUpdateList[vF.id] = false;
			});
		});
	}

	deleteGeneralStorageFactor(id: string | number): void {
		this.facilityService.deleteGeneralStorageFactor(this.facility_id, id).subscribe((res: GeneralStorageFactor[]): void => {
			this.generalStorageFactors = res;
			this.factorChanged.emit();

		});
	}

	changeStorageToUpdate(vF: GeneralStorageFactor): void {
		this.storageUpdateList[vF.id] = !this.storageUpdateList[vF.id];
	}

	reloadGeneralStorageFactor(vF: GeneralStorageFactor): void {
		this.facilityService.getGeneralStorageFactor(this.facility_id, vF.id).subscribe((volumeFactor: GeneralStorageFactor): void => {
			this.generalStorageFactors[this.generalStorageFactors.indexOf(vF)] = new GeneralStorageFactor(volumeFactor);
		});
	}

	addGeneralStorageFactor(): void {

		this.facilityService.addGeneralStorageFactor(this.facility_id, this.newFactor).subscribe((res: GeneralStorageFactor[]): void => {
			this.newFactor = new GeneralStorageFactor(null);
			this.generalStorageFactors = res;
			this.generalStorageFactors.forEach((vF: GeneralStorageFactor): void => {
				this.storageUpdateList[vF.id] = false;
			});
			this.factorChanged.emit();
		});

	}

	updateGeneralStorageFactor(vf: GeneralStorageFactor): void {

		this.facilityService.updateGeneralStorageFactor(this.facility_id, vf).subscribe((volumeFactor: GeneralStorageFactor): void => {
			this.generalStorageFactors[this.generalStorageFactors.indexOf(vf)] = new GeneralStorageFactor(volumeFactor);
			this.factorChanged.emit();

		});

	}

}
