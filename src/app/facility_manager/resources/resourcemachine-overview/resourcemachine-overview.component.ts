import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FacilityService} from '../../../api-connector/facility.service';
import {ResourceMachine} from '../resource-machine';
import {GPUSpecification} from "../gpu-specification";

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
    this.newResourceMachine = new ResourceMachine();
    this.facilityService.getGPUSpecifications(this.facility_id).subscribe((specs: GPUSpecification[]): void => {
      this.gpu_types = specs;
    });
  }

  getResourceMachines(): void {
    this.facilityService.getResourceMachines(this.facility_id).subscribe((res: ResourceMachine[]): void => {
      this.resourceMachines = res;
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
      this.resourceMachines = res;
      this.factorChanged.emit()

    })
  }

  changeResourceMachineToUpdate(machine: ResourceMachine): void {
    this.resourceMachineUpdateList[machine.id] = !this.resourceMachineUpdateList[machine.id]
  }

  reloadResourceMachine(rf: ResourceMachine): void {
    this.facilityService.getResourceMachine(this.facility_id, rf.id).subscribe((machine: ResourceMachine): void => {
      this.resourceMachines[this.resourceMachines.indexOf(rf)] = machine;
    })
  }

  addResourceMachine(): void {

    this.facilityService.addResourceMachine(this.facility_id, this.newResourceMachine).subscribe((res: ResourceMachine[]): void => {
      this.newResourceMachine = new ResourceMachine();
      this.resourceMachines = res;
      this.resourceMachines.forEach((rf: ResourceMachine): void => {
        this.resourceMachineUpdateList[rf.id] = false;
      })
      this.factorChanged.emit()
    });

  }

  updateResourceMachine(rf: ResourceMachine): void {

    this.facilityService.updateResourceMachine(this.facility_id, rf).subscribe((machine: ResourceMachine): void => {
      this.resourceMachines[this.resourceMachines.indexOf(rf)] = machine;
      this.factorChanged.emit()

    })

  }

}
