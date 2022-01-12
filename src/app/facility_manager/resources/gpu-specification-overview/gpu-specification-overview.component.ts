import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import {
	FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms';
import { FacilityService } from '../../../api-connector/facility.service';
import { GPUSpecification } from '../gpu-specification';

/**
 * Class for GPU-Specifications
 */
@Component({
	selector: 'app-gpu-specification-overview',
	templateUrl: './gpu-specification-overview.component.html',
	providers: [FacilityService],
})
export class GPUSpecificationOverviewComponent implements OnInit {
	gpuSpecifications: GPUSpecification[];
	newGPUSpecification: GPUSpecification;
	newGPUFormGroup: FormGroup;
	formBuilder: FormBuilder = new FormBuilder();
	gpuFormGroups: { [id: string]: FormGroup } = {};

	@Input() facility_id: number;
	@Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

	gpuSpecificationUpdateList: { [id: string]: boolean } = {};

	constructor(private facilityService: FacilityService) {
		this.facilityService = facilityService;
	}

	ngOnInit(): void {
		this.getGPUSpecifications();
		console.log(this.facility_id);
		this.newGPUSpecification = new GPUSpecification(null);
		this.newGPUFormGroup = this.formBuilder
			.group({
				new_gpu_type: [null, Validators.compose([Validators.required, Validators.pattern(/^([A-Za-z0-9]+[ ]*)+$/)])],
				new_gpu_cores: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_gpu_ram: [0, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
			});
		this.listenToChangesForNewGPUs();
	}

	listenToChangesForNewGPUs(): void {
		this.newGPUFormGroup.get('new_gpu_type').valueChanges.subscribe((val: string): void => {
			this.newGPUSpecification.type = val;
		});
		this.newGPUFormGroup.get('new_gpu_ram').valueChanges.subscribe((val: number): void => {
			this.newGPUSpecification.ram = val;
		});
		this.newGPUFormGroup.get('new_gpu_cores').valueChanges.subscribe((val: number): void => {
			this.newGPUSpecification.cores = val;
		});
	}

	getGPUSpecifications(): void {
		this.facilityService.getGPUSpecifications(this.facility_id).subscribe((gpus: GPUSpecification[]): void => {
			this.gpuSpecifications = gpus.map((gpu: GPUSpecification): GPUSpecification => new GPUSpecification(gpu));
			this.gpuSpecifications.forEach((gpu: GPUSpecification): void => {
				this.gpuSpecificationUpdateList[gpu.id] = false;
				this.setupFormGroup(gpu);
			});
		});
	}

	setupFormGroup(gpu: GPUSpecification): void {
		this.gpuFormGroups[gpu.id] = this.formBuilder.group({});
		const gpu_ram: string = `${gpu.id}_ram`;
		const gpu_type: string = `${gpu.id}_type`;
		const gpu_cores: string = `${gpu.id}_cores`;

		this.gpuFormGroups[gpu.id].addControl(gpu_ram, new FormControl([null]));
		this.gpuFormGroups[gpu.id].get(gpu_ram)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);
		this.gpuFormGroups[gpu.id].addControl(gpu_type, new FormControl([null]));
		this.gpuFormGroups[gpu.id].get(gpu_type)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^([A-Za-z0-9]+[ ]*)+$/)])]);

		this.gpuFormGroups[gpu.id].addControl(gpu_cores, new FormControl([null]));
		this.gpuFormGroups[gpu.id].get(gpu_cores)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);

		this.gpuFormGroups[gpu.id].get(gpu_ram).setValue(gpu.ram);
		this.gpuFormGroups[gpu.id].get(gpu_type).setValue(gpu.type);
		this.gpuFormGroups[gpu.id].get(gpu_cores).setValue(gpu.cores);
		this.gpuFormGroups[gpu.id].disable();

	}

	deleteGPUSpecification(id: string | number): void {
		this.facilityService.deleteGPUSpecification(this.facility_id, id).subscribe((gpus: GPUSpecification[]): void => {
			this.gpuFormGroups = {};
			gpus.forEach((gpu: GPUSpecification): void => {
				this.setupFormGroup(gpu);
			});
			this.gpuSpecifications = gpus.map((gpu: GPUSpecification): GPUSpecification => new GPUSpecification(gpu));
			this.factorChanged.emit();

		});
	}

	changeGPUSpecificationToUpdate(gpu: GPUSpecification): void {
		if (this.gpuSpecificationUpdateList[gpu.id]) {
			this.gpuFormGroups[gpu.id].disable();
		} else {
			this.listenToChangesForGPU(gpu);
			this.gpuFormGroups[gpu.id].enable();
		}
		this.gpuSpecificationUpdateList[gpu.id] = !this.gpuSpecificationUpdateList[gpu.id];
	}

	listenToChangesForGPU(gpu: GPUSpecification) {
		this.gpuFormGroups[gpu.id].get(`${gpu.id}_ram`).valueChanges.subscribe((val: number): void => {
			gpu.ram = val;
		});
		this.gpuFormGroups[gpu.id].get(`${gpu.id}_type`).valueChanges.subscribe((val: string): void => {
			gpu.type = val;
		});
		this.gpuFormGroups[gpu.id].get(`${gpu.id}_cores`).valueChanges.subscribe((val: number): void => {
			gpu.cores = val;
		});
	}

	reloadGPUSpecification(gpu: GPUSpecification): void {
		this.facilityService.getGPUSpecification(this.facility_id, gpu.id).subscribe((fs_gpu: GPUSpecification): void => {
			this.gpuSpecifications[this.gpuSpecifications.indexOf(gpu)] = new GPUSpecification(fs_gpu);
			this.reloadGPUForm(fs_gpu);
		});
	}

	reloadGPUForm(gpu: GPUSpecification): void {
		const gpu_ram: string = `${gpu.id}_ram`;
		const gpu_type: string = `${gpu.id}_type`;
		const gpu_cores: string = `${gpu.id}_cores`;
		this.gpuFormGroups[gpu.id].get(gpu_ram).setValue(gpu.ram);
		this.gpuFormGroups[gpu.id].get(gpu_type).setValue(gpu.type);
		this.gpuFormGroups[gpu.id].get(gpu_cores).setValue(gpu.cores);

		this.gpuFormGroups[gpu.id].disable();
	}

	addGPUSpecification(): void {
		this.newGPUSpecification.type = this.newGPUSpecification.type.trim();
		this.facilityService.addGPUSpecification(this.facility_id, this.newGPUSpecification).subscribe((res: GPUSpecification[]): void => {
			this.newGPUSpecification = new GPUSpecification(null);
			res.forEach((gpu: GPUSpecification): void => {
				this.setupFormGroup(gpu);
			});
			this.gpuSpecifications = res.map((gpu: GPUSpecification): GPUSpecification => new GPUSpecification(gpu));
			this.gpuSpecifications.forEach((rf: GPUSpecification): void => {
				this.gpuSpecificationUpdateList[rf.id] = false;
			});
			this.factorChanged.emit();
		});
	}

	updateGPUSpecification(gpu: GPUSpecification): void {
		gpu.type = gpu.type.trim();
		this.facilityService.updateGPUSpecification(this.facility_id, gpu).subscribe((machine: GPUSpecification): void => {
			this.gpuSpecifications[this.gpuSpecifications.indexOf(gpu)] = machine;
			this.setupFormGroup(gpu);
			this.factorChanged.emit();

		});
	}

}
