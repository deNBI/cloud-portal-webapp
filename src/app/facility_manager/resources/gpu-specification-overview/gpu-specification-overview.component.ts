import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { FacilityService } from '../../../api-connector/facility.service';
import { GPUSpecification } from '../gpu-specification';

/**
 * Class for ramfactors..
 */
@Component({
	selector: 'app-gpu-specification-overview',
	templateUrl: './gpu-specification-overview.component.html',
	providers: [FacilityService],
})
export class GPUSpecificationOverviewComponent implements OnInit {
	factor_types: string[] = ['HIGH_MEMORY', 'GENERAL_PURPOSE', 'MIDCLASS'];
	gpuSpecifications: GPUSpecification[];
	newGPUSpecification: GPUSpecification;
	@Input() facility_id: number;
	@Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

	gpuSpecificationUpdateList: { [id: string]: boolean } = {};

	constructor(private facilityService: FacilityService) {
		this.facilityService = facilityService;
	}

	ngOnInit(): void {
		this.getGPUSpecifications();
		this.newGPUSpecification = new GPUSpecification();

	}

	getGPUSpecifications(): void {
		this.facilityService.getGPUSpecifications(this.facility_id).subscribe((gpus: GPUSpecification[]): void => {
			this.gpuSpecifications = gpus;
			this.gpuSpecifications.forEach((machine: GPUSpecification): void => {
				this.gpuSpecificationUpdateList[machine.id] = false;
			});
		});
	}

	deleteGPUSpecification(id: string | number): void {
		this.facilityService.deleteGPUSpecification(this.facility_id, id).subscribe((gpus: GPUSpecification[]): void => {
			this.gpuSpecifications = gpus;
			this.factorChanged.emit();

		});
	}

	changeGPUSpecificationToUpdate(gpu: GPUSpecification): void {
		this.gpuSpecificationUpdateList[gpu.id] = !this.gpuSpecificationUpdateList[gpu.id];
	}

	reloadGPUSpecification(gpu: GPUSpecification): void {
		this.facilityService.getGPUSpecification(this.facility_id, gpu.id).subscribe((fs_gpu: GPUSpecification): void => {
			this.gpuSpecifications[this.gpuSpecifications.indexOf(gpu)] = fs_gpu;
		});
	}

	addGPUSpecification(): void {
		this.facilityService.addGPUSpecification(this.facility_id, this.newGPUSpecification).subscribe((res: GPUSpecification[]): void => {
			this.newGPUSpecification = new GPUSpecification();
			this.gpuSpecifications = res;
			this.gpuSpecifications.forEach((rf: GPUSpecification): void => {
				this.gpuSpecificationUpdateList[rf.id] = false;
			});
			this.factorChanged.emit();
		});

	}

	updateGPUSpecification(gpu: GPUSpecification): void {

		this.facilityService.updateGPUSpecification(this.facility_id, gpu).subscribe((machine: GPUSpecification): void => {
			this.gpuSpecifications[this.gpuSpecifications.indexOf(gpu)] = machine;
			this.factorChanged.emit();

		});

	}

}
