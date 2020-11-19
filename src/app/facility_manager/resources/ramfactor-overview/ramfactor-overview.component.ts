import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RamFactor} from '../ram-factor';
import {FacilityService} from '../../../api-connector/facility.service';

/**
 * Class for ramfactors..
 */
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
  @Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

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
      this.ramFactors.sort((a_factor: RamFactor, b_factor: RamFactor): number => {
        return b_factor.type.localeCompare(a_factor.type)
      })
      this.ramFactors.forEach((ramFactor: RamFactor): void => {
        this.ramUpdateList[ramFactor.id] = false;
      })
    })
  }

  deleteRamFactor(id: string | number): void {
    this.facilityService.deleteRamFactor(this.facility_id, id).subscribe((res: RamFactor[]): void => {
      this.ramFactors = res;
      this.factorChanged.emit()

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
      this.factorChanged.emit()

    })

  }

  updateRamFactor(rf: RamFactor): void {

    this.facilityService.updateRamFactor(this.facility_id, rf).subscribe((ramFactor: RamFactor): void => {
      this.ramFactors[this.ramFactors.indexOf(rf)] = new RamFactor(ramFactor);
      this.factorChanged.emit()

    })

  }

}
