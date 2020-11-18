import {Component, Input, OnInit} from '@angular/core';
import {CoreFactor} from '../core-factor';
import {FacilityService} from '../../../api-connector/facility.service';

@Component({
             selector: 'app-corefactor-overview',
             templateUrl: './corefactor-overview.component.html',
             providers: [FacilityService]

           })
export class CorefactorOverviewComponent implements OnInit {
  factor_types: string[] = ['HIGH_MEMORY', 'GENERAL_PURPOSE', 'MIDCLASS'];
  coreFactors: CoreFactor[];
  newFactor: CoreFactor;
  @Input() facility_id: number;
  coreUpdateList: { [id: string]: boolean } = {};

  constructor(private facilityService: FacilityService) {
  }

  ngOnInit(): void {
    this.getCoreFactors()
    this.newFactor = new CoreFactor(null)

  }

  getCoreFactors(): void {
    this.facilityService.getCoreFactors(this.facility_id).subscribe((res: CoreFactor[]): void => {
      this.coreFactors = res;
      this.coreFactors.sort((a_factor: CoreFactor, b_factor: CoreFactor): number => {
        return b_factor.type.localeCompare(a_factor.type)
      })
      this.coreFactors.forEach((coreFactor: CoreFactor): void => {
        this.coreUpdateList[coreFactor.id] = false;
      })
    })
  }

  deleteCoreFactor(id: string | number): void {
    this.facilityService.deleteCoreFactor(this.facility_id, id).subscribe((res: CoreFactor[]): void => {
      this.coreFactors = res;

    })
  }

  changeCoreToUpdate(coreFactor: CoreFactor): void {
    this.coreUpdateList[coreFactor.id] = !this.coreUpdateList[coreFactor.id]

  }

  reloadCoreFactor(cf: CoreFactor): void {
    this.facilityService.getCoreFactor(this.facility_id, cf.id).subscribe((coreFactor: CoreFactor): void => {
      this.coreFactors[this.coreFactors.indexOf(cf)] = new CoreFactor(coreFactor);
    })
  }

  addCoreFactor(): void {

    this.facilityService.addCoresFactor(this.facility_id, this.newFactor).subscribe((res: CoreFactor[]): void => {
      this.newFactor = new CoreFactor(null);
      this.coreFactors = res;
      this.coreFactors.forEach((coreFactor: CoreFactor): void => {
        this.coreUpdateList[coreFactor.id] = false;
      })
    })

  }

  updateCoreFactor(cf: CoreFactor): void {

    this.facilityService.updateCoreFactor(this.facility_id, cf).subscribe((coreFactor: CoreFactor): void => {
      this.coreFactors[this.coreFactors.indexOf(cf)] = new CoreFactor(coreFactor);

    })

  }

}
