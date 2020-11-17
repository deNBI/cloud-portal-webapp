import {Component, Input, OnInit} from '@angular/core';
import {RamFactor} from '../ram-factor';
import {FacilityService} from '../../../api-connector/facility.service';

@Component({
             selector: 'app-ramfactor-overview',
             templateUrl: './ramfactor-overview.component.html',
             providers: [FacilityService]
           })
export class RamfactorOverviewComponent implements OnInit {
  factor_types: string[] = ['HIGH_MEMORY', 'GENERAL_PURPOSE', 'MIDCLASS'];
  ramFactors: RamFactor[];
  newFactor: RamFactor;
  @Input() facility_id: number;
  ramUpdateList: { [id: string]: boolean } = {};

  constructor(private facilityService: FacilityService) {
  }

  ngOnInit(): void {
    this.getRamFactors()
    this.newFactor = new RamFactor(null)

  }

  getRamFactors(): void {
    this.facilityService.getRamFactors(this.facility_id).subscribe((res: RamFactor[]): void => {
      this.ramFactors = res;
      this.ramFactors.forEach((ramFactor: RamFactor): void => {
        this.ramUpdateList[ramFactor.id] = false;
      })
    })
  }

  deleteRamFactor(id: string | number): void {
    this.facilityService.deleteRamFactor(this.facility_id, id).subscribe((res: RamFactor[]): void => {
      this.ramFactors = res;

    })
  }

  changeRamToUpdate(ramFactor: RamFactor): void {
    this.ramUpdateList[ramFactor.id] = !this.ramUpdateList[ramFactor.id]
  }

  reloadRamFactor(rf: RamFactor): void {
    this.facilityService.getRamFactor(this.facility_id, rf.id).subscribe((ramFactor: RamFactor): void => {
      this.ramFactors[this.ramFactors.indexOf(rf)] = new RamFactor(ramFactor);
    })
  }

  addRamFactor(): void {

    this.facilityService.addRamFactor(this.facility_id, this.newFactor).subscribe((res: RamFactor[]): void => {
      this.newFactor = new RamFactor(null);
      this.ramFactors = res;
      this.ramFactors.forEach((ramFactor: RamFactor): void => {
        this.ramUpdateList[ramFactor.id] = false;
      })
    })

  }

  updateRamFactor(rf: RamFactor): void {

    this.facilityService.updateRamFactor(this.facility_id, rf).subscribe((ramFactor: RamFactor): void => {
      this.ramFactors[this.ramFactors.indexOf(rf)] = new RamFactor(ramFactor);

    })

  }

}
