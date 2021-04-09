import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { ObjectStorageFactor } from '../object-storage-factor';
import { FacilityService } from '../../../api-connector/facility.service';

/**
 * Class for objectfactors.
 */
@Component({
	selector: 'app-objectstoragefactor-overview',
	templateUrl: './objectstoragefactor-overview.component.html',
	providers: [FacilityService],

})
export class ObjectstoragefactorOverviewComponent implements OnInit {
	objectStorageFactors: ObjectStorageFactor[];
	newFactor: ObjectStorageFactor;
	@Input() facility_id: number;
	@Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

	objectUpdateList: { [id: string]: boolean } = {};

	constructor(private facilityService: FacilityService) {
		this.facilityService = facilityService;
	}

	ngOnInit(): void {
		this.getObjectStorageFactors();
		this.newFactor = new ObjectStorageFactor(null);

	}

	getObjectStorageFactors(): void {
		this.facilityService.getObjectStorageFactors(this.facility_id).subscribe((res: ObjectStorageFactor[]): void => {
			this.objectStorageFactors = res;
			this.objectStorageFactors.sort((a_factor: ObjectStorageFactor, b_factor: ObjectStorageFactor): number => {
				if (a_factor.storage > b_factor.storage) {
					return 1;
				} else if (a_factor.storage === b_factor.storage) {
					return 0;
				} else {
					return -1;
				}

			});
			this.objectStorageFactors.forEach((objectStorageFactor: ObjectStorageFactor): void => {
				this.objectUpdateList[objectStorageFactor.id] = false;
			});
		});
	}

	deleteObjectStorageFactor(id: string | number): void {
		this.facilityService.deleteObjectStorageFactor(this.facility_id, id).subscribe((res: ObjectStorageFactor[]): void => {
			this.objectStorageFactors = res;
			this.factorChanged.emit();

		});
	}

	changeObjectStorageToUpdate(objectStorageFactor: ObjectStorageFactor): void {
		this.objectUpdateList[objectStorageFactor.id] = !this.objectUpdateList[objectStorageFactor.id];
	}

	reloadObjectStorageFactor(of: ObjectStorageFactor): void {
		this.facilityService.getObjectStorageFactor(this.facility_id, of.id).subscribe((objectStorageFactor: ObjectStorageFactor): void => {
			this.objectStorageFactors[this.objectStorageFactors.indexOf(of)] = new ObjectStorageFactor(objectStorageFactor);
		});
	}

	addObjectStorageFactor(): void {

		this.facilityService.addObjectStorageFactor(this.facility_id, this.newFactor).subscribe((res: ObjectStorageFactor[]): void => {
			this.newFactor = new ObjectStorageFactor(null);
			this.objectStorageFactors = res;
			this.objectStorageFactors.forEach((objectStorageFactor: ObjectStorageFactor): void => {
				this.objectUpdateList[objectStorageFactor.id] = false;
			});
			this.factorChanged.emit();

		});

	}

	updateObjectStorageFactor(of: ObjectStorageFactor): void {

		this.facilityService.updateObjectStorageFactor(this.facility_id, of).subscribe((objectStorageFactor: ObjectStorageFactor): void => {
			this.objectStorageFactors[this.objectStorageFactors.indexOf(of)] = new ObjectStorageFactor(objectStorageFactor);

		});
		this.factorChanged.emit();

	}

}
