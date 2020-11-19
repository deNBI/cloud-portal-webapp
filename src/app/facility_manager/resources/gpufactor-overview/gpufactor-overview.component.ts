import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FacilityService} from '../../../api-connector/facility.service';
import {GpuFactor} from '../gpu-factor';

@Component({
             selector: 'app-gpufactor-overview',
             templateUrl: './gpufactor-overview.component.html',
             providers: [FacilityService]

           })
export class GpufactorOverviewComponent implements OnInit {

  gpuFactors: GpuFactor[];
  newFactor: GpuFactor;
  @Input() facility_id: number;
  @Output() readonly factorChanged: EventEmitter<any> = new EventEmitter();

  gpuUpdateList: { [id: string]: boolean } = {};

  constructor(private facilityService: FacilityService) {
  }

  ngOnInit(): void {
    this.getGpuFactors()
    this.newFactor = new GpuFactor(null)

  }

  getGpuFactors(): void {
    this.facilityService.getGpuFactors(this.facility_id).subscribe((res: GpuFactor[]): void => {
      this.gpuFactors = res;
      this.gpuFactors.sort((a_factor: GpuFactor, b_factor: GpuFactor): number => {
        if (a_factor.count > b_factor.count) {
          return 1
        } else if (a_factor.count === b_factor.count) {
          return 0
        } else {
          return -1
        }

      })
      this.gpuFactors.forEach((gpuFactor: GpuFactor): void => {
        this.gpuUpdateList[gpuFactor.id] = false;
      })
    })
  }

  deleteGpuFactor(id: string | number): void {
    this.facilityService.deleteGpuFactor(this.facility_id, id).subscribe((res: GpuFactor[]): void => {
      this.gpuFactors = res;
      this.factorChanged.emit()

    })
  }

  changeGpuToUpdate(gpuFactor: GpuFactor): void {
    this.gpuUpdateList[gpuFactor.id] = !this.gpuUpdateList[gpuFactor.id]
  }

  reloadGpuFactor(gpuFactor: GpuFactor): void {
    this.facilityService.getGpuFactor(this.facility_id, gpuFactor.id).subscribe((objectStorageFactor: GpuFactor): void => {
      this.gpuFactors[this.gpuFactors.indexOf(gpuFactor)] = new GpuFactor(objectStorageFactor);
    })
  }

  addGpuFactor(): void {

    this.facilityService.addGpuFactor(this.facility_id, this.newFactor).subscribe((res: GpuFactor[]): void => {
      this.newFactor = new GpuFactor(null);
      this.gpuFactors = res;
      this.gpuFactors.forEach((gpuFactor: GpuFactor): void => {
        this.gpuUpdateList[gpuFactor.id] = false;
      })
      this.factorChanged.emit()

    })

  }

  updateGpuFactor(gpuFactor: GpuFactor): void {

    this.facilityService.updateGpuFactor(this.facility_id, gpuFactor).subscribe((objectStorageFactor: GpuFactor): void => {
      this.gpuFactors[this.gpuFactors.indexOf(gpuFactor)] = new GpuFactor(objectStorageFactor);
      this.factorChanged.emit()

    })

  }

}
