import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { FacilityService } from '../../../api-connector/facility.service';
import { VolumeStorageFactor } from '../volume-storage-factor';

/**
 * Class for ramfactors.
 */
@Component({
	selector: 'app-volumestoragefactor-overview',
	templateUrl: './volumestoragefactor-overview.component.html',
	providers: [FacilityService],

})
export class VolumestoragefactorOverviewComponent implements OnInit {
	volumeStorageFactors: VolumeStorageFactor[];
	@Input() facility_id: number;
	@Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

	newFactor: VolumeStorageFactor;
	volumeUpdateList: { [id: string]: boolean } = {};

	constructor(private facilityService: FacilityService) {
		this.facilityService = facilityService;
	}

	ngOnInit(): void {
		this.getVolumeStorageFactors();
		this.newFactor = new VolumeStorageFactor(null);

	}

	getVolumeStorageFactors(): void {
		this.facilityService.getVolumeStorageFactors(this.facility_id).subscribe((res: VolumeStorageFactor[]): void => {
			this.volumeStorageFactors = res;
			this.volumeStorageFactors.sort((a_factor: VolumeStorageFactor, b_factor: VolumeStorageFactor): number => {
				if (a_factor.storage > b_factor.storage) {
					return 1;
				} else if (a_factor.storage === b_factor.storage) {
					return 0;
				} else {
					return -1;
				}

			});
			this.volumeStorageFactors.forEach((vF: VolumeStorageFactor): void => {
				this.volumeUpdateList[vF.id] = false;
			});
		});
	}

	deleteVolumeStorageFactor(id: string | number): void {
		this.facilityService.deleteVolumeStorageFactor(this.facility_id, id).subscribe((res: VolumeStorageFactor[]): void => {
			this.volumeStorageFactors = res;
			this.factorChanged.emit();

		});
	}

	changeVolumeStorageToUpdate(vF: VolumeStorageFactor): void {
		this.volumeUpdateList[vF.id] = !this.volumeUpdateList[vF.id];
	}

	reloadVolumeStorageFactor(vF: VolumeStorageFactor): void {
		this.facilityService.getVolumeStorageFactor(this.facility_id, vF.id).subscribe((volumeFactor: VolumeStorageFactor): void => {
			this.volumeStorageFactors[this.volumeStorageFactors.indexOf(vF)] = new VolumeStorageFactor(volumeFactor);
		});
	}

	addVolumeStorageFactor(): void {

		this.facilityService.addVolumeStorageFactor(this.facility_id, this.newFactor).subscribe((res: VolumeStorageFactor[]): void => {
			this.newFactor = new VolumeStorageFactor(null);
			this.volumeStorageFactors = res;
			this.volumeStorageFactors.forEach((vF: VolumeStorageFactor): void => {
				this.volumeUpdateList[vF.id] = false;
			});
			this.factorChanged.emit();
		});

	}

	updateVolumeStorageFactor(vf: VolumeStorageFactor): void {

		this.facilityService.updateVolumeStorageFactor(this.facility_id, vf).subscribe((volumeFactor: VolumeStorageFactor): void => {
			this.volumeStorageFactors[this.volumeStorageFactors.indexOf(vf)] = new VolumeStorageFactor(volumeFactor);
			this.factorChanged.emit();

		});

	}

}
