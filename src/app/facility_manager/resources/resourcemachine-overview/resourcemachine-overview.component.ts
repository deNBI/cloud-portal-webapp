import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import {
	FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms';
import { FacilityService } from '../../../api-connector/facility.service';
import { ResourceMachine } from '../resource-machine';
import { GPUSpecification } from '../gpu-specification';

/**
 * Class for ramfactors..
 */
@Component({
	selector: 'app-resourcemachine-overview',
	templateUrl: './resourcemachine-overview.component.html',
	providers: [FacilityService],
})
export class ResourcemachineOverviewComponent implements OnInit {
	factor_types: string[] = ['HIGH_MEMORY', 'GENERAL_PURPOSE', 'MIDCLASS'];
	gpu_types: GPUSpecification[] = [];
	resourceMachines: ResourceMachine[];
	newResourceMachine: ResourceMachine;
	newMachineFormGroup: FormGroup;
	emptySpec: GPUSpecification = new GPUSpecification(null);
	formBuilder: FormBuilder = new FormBuilder();
	machinesFormGroups: { [id: string]: FormGroup } = {};
	name: string = '';
	@Input() facility_id: number;
	@Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

	resourceMachineUpdateList: { [id: string]: boolean } = {};

	constructor(private facilityService: FacilityService) {
		this.facilityService = facilityService;
	}

	ngOnInit(): void {
		this.getResourceMachines();
		this.newResourceMachine = new ResourceMachine(null);
		this.newMachineFormGroup = this.formBuilder
			.group({
				new_machine_ram: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_machine_ram_private_factor: [null, Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])],
				new_machine_ram_public_factor: [null, Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])],
				new_machine_cores: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_machine_cores_private_factor: [null, Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])],
				new_machine_cores_public_factor: [null, Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])],
				new_machine_gpus: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_machine_local_disk_storage: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_machine_name: [null, Validators.compose([Validators.required, Validators.pattern(/^([A-Za-z0-9]+[ ]*)+$/)])],
				new_machine_private_count: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_machine_public_count: [null, Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
				new_machine_local_disk_encrypted: [null],
				new_machine_type: [null, Validators.required],
			});

		this.listenToChangesForNewMachine();

		this.facilityService.getGPUSpecifications(this.facility_id).subscribe((specs: GPUSpecification[]): void => {
			this.gpu_types = specs;
		});
	}

	listenToChangesForNewMachine(): void {
		this.newMachineFormGroup.get('new_machine_ram').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.ram = val;
		});
		this.newMachineFormGroup.get('new_machine_ram_private_factor').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.ram_private_factor = val;
		});
		this.newMachineFormGroup.get('new_machine_ram_public_factor').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.ram_public_factor = val;
		});
		this.newMachineFormGroup.get('new_machine_cores').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.cores = val;
		});
		this.newMachineFormGroup.get('new_machine_cores_private_factor').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.cores_private_factor = val;
		});
		this.newMachineFormGroup.get('new_machine_cores_public_factor').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.cores_public_factor = val;
		});
		this.newMachineFormGroup.get('new_machine_gpus').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.gpu_slots = val;
			this.newResourceMachine.changeGpuUsed();
		});
		this.newMachineFormGroup.get('new_machine_name').valueChanges.subscribe((val: string): void => {
			this.newResourceMachine.name = val;
		});
		this.newMachineFormGroup.get('new_machine_local_disk_storage').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.local_disk_storage = val;
		});
		this.newMachineFormGroup.get('new_machine_private_count').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.private_count = val;
		});
		this.newMachineFormGroup.get('new_machine_public_count').valueChanges.subscribe((val: number): void => {
			this.newResourceMachine.public_count = val;
		});
		this.newMachineFormGroup.get('new_machine_local_disk_encrypted').valueChanges.subscribe((val: boolean): void => {
			this.newResourceMachine.local_disk_encrypted = val;
		});
		this.newMachineFormGroup.get('new_machine_type').valueChanges.subscribe((val: string): void => {
			this.newResourceMachine.type = val;
		});
	}

	detectGPUChanges(machine_id: number | string, slot: number | string): void {
		if (machine_id === -1) {
			const gpu_id: string = this.newMachineFormGroup.get(`new_machine_gpu_used_${slot}`).value;
			this.newResourceMachine.gpu_used[slot] = this.gpu_types.find((gpu: GPUSpecification): boolean => gpu.id === gpu_id);
		} else {
			const machine: ResourceMachine = this.resourceMachines.find((gpu: GPUSpecification): boolean => gpu.id === machine_id);
			const gpu_id: string = this.machinesFormGroups[machine_id].get(`${machine.id}_gpu_used_${slot}`).value;
			machine.gpu_slots[slot] = this.gpu_types.find((gpu: GPUSpecification): boolean => gpu.id === gpu_id);
		}

	}

	getResourceMachines(): void {
		this.facilityService.getResourceMachines(this.facility_id).subscribe((res: ResourceMachine[]): void => {
			this.resourceMachines = res.map((machine: ResourceMachine): ResourceMachine => new ResourceMachine(machine));
			this.resourceMachines
				.sort((a_machine: ResourceMachine, b_machine: ResourceMachine): number => b_machine.type.localeCompare(a_machine.type));
			this.machinesFormGroups = {};
			this.resourceMachines.forEach((machine: ResourceMachine): void => {
				machine.gpu_used.slice(0, machine.gpu_slots);
				this.resourceMachineUpdateList[machine.id] = false;
				this.setupFormGroup(machine);
			});
		});
	}

	setupFormGroup(machine: ResourceMachine): void {
		this.machinesFormGroups[machine.id] = this.formBuilder.group({});
		const machine_ram: string = `${machine.id}_ram`;
		const machine_ram_private_factor: string = `${machine.id}_ram_private_factor`;
		const machine_ram_public_factor: string = `${machine.id}_ram_public_factor`;
		const machine_cores: string = `${machine.id}_cores`;
		const machine_cores_private_factor: string = `${machine.id}_cores_private_factor`;
		const machine_cores_public_factor: string = `${machine.id}_cores_public_factor`;
		const machine_gpus: string = `${machine.id}_gpus`;
		const machine_local_disk_storage: string = `${machine.id}_local_disk_storage`;
		const machine_local_disk_encrypted: string = `${machine.id}_local_disk_encrypted`;
		const machine_name: string = `${machine.id}_name`;
		const machine_type: string = `${machine.id}_type`;
		const machine_private_count: string = `${machine.id}_private_count`;
		const machine_public_count: string = `${machine.id}_public_count`;

		this.machinesFormGroups[machine.id].addControl(machine_ram, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_ram)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_ram_private_factor, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_ram_private_factor)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_ram_public_factor, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_ram_public_factor)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_cores, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_cores)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_cores_private_factor, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_cores_private_factor)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_cores_public_factor, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_cores_public_factor)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_gpus, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_gpus)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_local_disk_storage, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_local_disk_storage)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_local_disk_encrypted, new FormControl([null]));

		this.machinesFormGroups[machine.id].addControl(machine_name, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_name)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^([A-Za-z0-9]+[ ]*)+$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_type, new FormControl([null]));

		this.machinesFormGroups[machine.id].addControl(machine_private_count, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_private_count)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);
		this.machinesFormGroups[machine.id].addControl(machine_public_count, new FormControl([null]));
		this.machinesFormGroups[machine.id].get(machine_public_count)
			.setValidators([Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])]);

		this.machinesFormGroups[machine.id].get(machine_ram).setValue(machine.ram);
		this.machinesFormGroups[machine.id].get(machine_ram_private_factor).setValue(machine.ram_private_factor);
		this.machinesFormGroups[machine.id].get(machine_ram_public_factor).setValue(machine.ram_public_factor);
		this.machinesFormGroups[machine.id].get(machine_cores).setValue(machine.cores);
		this.machinesFormGroups[machine.id].get(machine_cores_private_factor).setValue(machine.cores_private_factor);
		this.machinesFormGroups[machine.id].get(machine_cores_public_factor).setValue(machine.cores_public_factor);
		this.machinesFormGroups[machine.id].get(machine_gpus).setValue(machine.gpu_slots);
		this.machinesFormGroups[machine.id].get(machine_local_disk_storage).setValue(machine.local_disk_storage);
		this.machinesFormGroups[machine.id].get(machine_local_disk_encrypted).setValue(machine.local_disk_encrypted);
		this.machinesFormGroups[machine.id].get(machine_name).setValue(machine.name);
		this.machinesFormGroups[machine.id].get(machine_type).setValue(machine.type);
		this.machinesFormGroups[machine.id].get(machine_private_count).setValue(machine.private_count);
		this.machinesFormGroups[machine.id].get(machine_public_count).setValue(machine.public_count);
		this.machinesFormGroups[machine.id].disable();
	}

	listenToChangesForMachine(machine: ResourceMachine): void {
		/* eslint-disable */
		this.machinesFormGroups[machine.id].get(`${machine.id}_ram`).valueChanges.subscribe((val: number): void => {
			machine.ram = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_ram_private_factor`).valueChanges.subscribe((val: number): void => {
			machine.ram_private_factor = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_ram_public_factor`).valueChanges.subscribe((val: number): void => {
			machine.ram_public_factor = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_cores`).valueChanges.subscribe((val: number): void => {
			machine.cores = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_cores_private_factor`).valueChanges.subscribe((val: number): void => {
			machine.cores_private_factor = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_cores_public_factor`).valueChanges.subscribe((val: number): void => {
			machine.cores_public_factor = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_gpus`).valueChanges.subscribe((val: number): void => {
			machine.gpu_slots = val;
			machine.changeGpuUsed();
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_name`).valueChanges.subscribe((val: string): void => {
			machine.name = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_local_disk_storage`).valueChanges.subscribe((val: number): void => {
			machine.local_disk_storage = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_private_count`).valueChanges.subscribe((val: number): void => {
			machine.private_count = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_public_count`).valueChanges.subscribe((val: number): void => {
			machine.public_count = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_local_disk_encrypted`).valueChanges.subscribe((val: boolean): void => {
			machine.local_disk_encrypted = val;
		});
		this.machinesFormGroups[machine.id].get(`${machine.id}_type`).valueChanges.subscribe((val: string): void => {
			machine.type = val;
		});
		/* eslint-enable */
	}

	deleteResourceMachine(id: string | number): void {
		this.facilityService.deleteResourceMachine(this.facility_id, id).subscribe((res: ResourceMachine[]): void => {
			this.machinesFormGroups = {};
			res.forEach((machine: ResourceMachine): void => {
				this.setupFormGroup(machine);
			});
			this.resourceMachines = res.map((machine: ResourceMachine): ResourceMachine => new ResourceMachine(machine));
			this.factorChanged.emit();
		});
	}

	changeResourceMachineToUpdate(machine: ResourceMachine): void {
		if (this.resourceMachineUpdateList[machine.id]) {
			this.machinesFormGroups[machine.id].disable();
		} else {
			this.listenToChangesForMachine(machine);
			this.machinesFormGroups[machine.id].enable();
		}
		this.resourceMachineUpdateList[machine.id] = !this.resourceMachineUpdateList[machine.id];
	}

	reloadResourceMachine(rf: ResourceMachine): void {
		this.facilityService.getResourceMachine(this.facility_id, rf.id).subscribe((machine: ResourceMachine): void => {
			this.resourceMachines[this.resourceMachines.indexOf(rf)] = new ResourceMachine(machine);
			this.reloadMachineForm(machine);
		});
	}

	reloadMachineForm(machine: ResourceMachine): void {
		const machine_ram: string = `${machine.id}_ram`;
		const machine_ram_private_factor: string = `${machine.id}_ram_private_factor`;
		const machine_ram_public_factor: string = `${machine.id}_ram_public_factor`;
		const machine_cores: string = `${machine.id}_cores`;
		const machine_cores_private_factor: string = `${machine.id}_cores_private_factor`;
		const machine_cores_public_factor: string = `${machine.id}_cores_public_factor`;
		const machine_gpus: string = `${machine.id}_gpus`;
		const machine_local_disk_storage: string = `${machine.id}_local_disk_storage`;
		const machine_local_disk_encrypted: string = `${machine.id}_local_disk_encrypted`;
		const machine_name: string = `${machine.id}_name`;
		const machine_type: string = `${machine.id}_type`;
		const machine_private_count: string = `${machine.id}_private_count`;
		const machine_public_count: string = `${machine.id}_public_count`;

		this.machinesFormGroups[machine.id].get(machine_ram).setValue(machine.ram);
		this.machinesFormGroups[machine.id].get(machine_ram_private_factor).setValue(machine.ram_private_factor);
		this.machinesFormGroups[machine.id].get(machine_ram_public_factor).setValue(machine.ram_public_factor);
		this.machinesFormGroups[machine.id].get(machine_cores).setValue(machine.cores);
		this.machinesFormGroups[machine.id].get(machine_cores_private_factor).setValue(machine.cores_private_factor);
		this.machinesFormGroups[machine.id].get(machine_cores_public_factor).setValue(machine.cores_public_factor);
		this.machinesFormGroups[machine.id].get(machine_gpus).setValue(machine.gpu_slots);
		this.machinesFormGroups[machine.id].get(machine_local_disk_storage).setValue(machine.local_disk_storage);
		this.machinesFormGroups[machine.id].get(machine_local_disk_encrypted).setValue(machine.local_disk_encrypted);
		this.machinesFormGroups[machine.id].get(machine_name).setValue(machine.name);
		this.machinesFormGroups[machine.id].get(machine_type).setValue(machine.type);
		this.machinesFormGroups[machine.id].get(machine_private_count).setValue(machine.private_count);
		this.machinesFormGroups[machine.id].get(machine_public_count).setValue(machine.local_disk_storage);
		this.machinesFormGroups[machine.id].disable();
	}

	addResourceMachine(): void {
		this.newResourceMachine.name = this.newResourceMachine.name.trim();
		this.facilityService.addResourceMachine(this.facility_id, this.newResourceMachine).subscribe((res: ResourceMachine[]): void => {
			this.newResourceMachine = new ResourceMachine(null);
			this.machinesFormGroups = {};
			res.forEach((machine: ResourceMachine): void => {
				this.setupFormGroup(machine);
			});
			this.resourceMachines = res.map((machine: ResourceMachine): ResourceMachine => new ResourceMachine(machine));

			this.resourceMachines.forEach((rf: ResourceMachine): void => {
				this.resourceMachineUpdateList[rf.id] = false;
			});
			this.factorChanged.emit();
		});

	}

	updateResourceMachine(rf: ResourceMachine): void {
		rf.name = rf.name.trim();
		this.facilityService.updateResourceMachine(this.facility_id, rf).subscribe((machine: ResourceMachine): void => {
			this.resourceMachines[this.resourceMachines.indexOf(rf)] = new ResourceMachine(machine);
			this.setupFormGroup(machine);
			this.factorChanged.emit();
		});
	}

}
