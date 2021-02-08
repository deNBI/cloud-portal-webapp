import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FacilityService} from '../../../api-connector/facility.service';
import {ResourceMachine} from '../resource-machine';
import {GPUSpecification} from '../gpu-specification';

/**
 * Class for ramfactors..
 */
@Component({
             selector: 'app-resourcemachine-overview',
             templateUrl: './resourcemachine-overview.component.html',
             providers: [FacilityService]
           })
export class ResourcemachineOverviewComponent implements OnInit {
  factor_types: string[] = ['HIGH_MEMORY', 'GENERAL_PURPOSE', 'MIDCLASS'];
  gpu_types: GPUSpecification[] = [];
  resourceMachines: ResourceMachine[];
  newResourceMachine: ResourceMachine;
  @Input() facility_id: number;
  @Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

  resourceMachineUpdateList: { [id: string]: boolean } = {};

  constructor(private facilityService: FacilityService) {
  }

  ngOnInit(): void {
    this.getResourceMachines();
    this.newResourceMachine = new ResourceMachine(null);
    this.facilityService.getGPUSpecifications(this.facility_id).subscribe((specs: GPUSpecification[]): void => {
      this.gpu_types = specs;
    });
  }

  getResourceMachines(): void {
    this.facilityService.getResourceMachines(this.facility_id).subscribe((res: ResourceMachine[]): void => {
      this.resourceMachines = res.map((machine: ResourceMachine): ResourceMachine => {
        return new ResourceMachine(machine)
      });
      this.resourceMachines.sort((a_machine: ResourceMachine, b_machine: ResourceMachine): number => {
        return b_machine.type.localeCompare(a_machine.type)
      })

      this.resourceMachines.forEach((machine: ResourceMachine): void => {
        machine.gpu_used.slice(0, machine.gpu_slots);
        this.resourceMachineUpdateList[machine.id] = false;
      })
    })
  }

  deleteResourceMachine(id: string | number): void {
    this.facilityService.deleteResourceMachine(this.facility_id, id).subscribe((res: ResourceMachine[]): void => {
      this.resourceMachines = res.map((machine: ResourceMachine): ResourceMachine => {
        return new ResourceMachine(machine)
      });
      this.factorChanged.emit()

    })
  }

  changeResourceMachineToUpdate(machine: ResourceMachine): void {
    this.resourceMachineUpdateList[machine.id] = !this.resourceMachineUpdateList[machine.id]
  }

  reloadResourceMachine(rf: ResourceMachine): void {
    this.facilityService.getResourceMachine(this.facility_id, rf.id).subscribe((machine: ResourceMachine): void => {
      this.resourceMachines[this.resourceMachines.indexOf(rf)] = new ResourceMachine(machine);
    })
  }

  addResourceMachine(): void {
    this.setGPUList(this.newResourceMachine);

    this.facilityService.addResourceMachine(this.facility_id, this.newResourceMachine).subscribe((res: ResourceMachine[]): void => {
      this.newResourceMachine = new ResourceMachine(null);
      this.resourceMachines = res.map((machine: ResourceMachine): ResourceMachine => {
        return new ResourceMachine(machine)
      });

      this.resourceMachines.forEach((rf: ResourceMachine): void => {
        this.resourceMachineUpdateList[rf.id] = false;
      })
      this.factorChanged.emit()
    });

  }

  setGPUList(rf: ResourceMachine): void {
    let gpus: GPUSpecification[] = [];
    rf.gpu_used.forEach((gpu: GPUSpecification): void => {
      if (gpu.type != undefined && gpu.type != 'UNUSED'){
        gpus.push(gpu);
      } else {
        console.log("UNUSED!!!");
      }
    });

    rf.gpu_used = gpus;
  }

  updateResourceMachine(rf: ResourceMachine): void {
    this.setGPUList(rf);

    this.facilityService.updateResourceMachine(this.facility_id, rf).subscribe((machine: ResourceMachine): void => {
      this.resourceMachines[this.resourceMachines.indexOf(rf)] = new ResourceMachine(machine);
      this.factorChanged.emit()

    })

  }

}
