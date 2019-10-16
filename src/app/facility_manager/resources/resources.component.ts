import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../../api-connector/facility.service';
import {Resources} from '../../vo_manager/resources/resources';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as'
import {CoreFactor} from './core-factor';
import {RamFactor} from './ram-factor';
import {forkJoin} from 'rxjs';

/**
 * Facility resource component.
 */
@Component({
             selector: 'app-resources',
             templateUrl: './resources.component.html',
             styleUrls: ['./resources.component.scss'],
             providers: [FacilityService, ExportAsService]

           })
export class ResourcesComponent implements OnInit {

  title: string = 'Resource Overview';
  public managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  isLoaded: boolean = false;
  resources: Resources [];

  /**
   * Id of the table which will be converted to pdf or csv.
   */
  tableId: string = 'contentToConvert';
  today: number = Date.now();
  coreFactors: CoreFactor[] = [];
  ramFactors: RamFactor[] = [];
  exportAsConfigCSV: ExportAsConfig = {
    type: 'csv',
    elementId: this.tableId
  };

  constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) {
  }

  addCoreFactor(cores: string | number, factor: string | number, description: string): void {
    if (cores && factor) {
      const re: any = /\,/gi;
      factor = factor.toString().replace(re, '.');
      this.facilityService.addCoresFactor(this.selectedFacility['FacilityId'], cores, factor, description)
        .subscribe((res: CoreFactor[]) => {
          this.coreFactors = res;
          this.getSelectedFacilityResources()
        })
    }
  }

  addRamFactor(ram: string | number, factor: string | number, description: string): void {
    if (ram && factor) {
      const re: any = /\,/gi;
      factor = factor.toString().replace(re, '.');
      this.facilityService.addRamFactor(this.selectedFacility['FacilityId'], ram, factor, description).subscribe((res: RamFactor[]) => {
        this.ramFactors = res;
        this.getSelectedFacilityResources()
      })
    }
  }

  onChangeSelectedFacility(): void {
    this.getSelectedFacilityResources()
  }

  ngOnInit(): void {
    this.facilityService.getManagerFacilities().subscribe((result: [string, number][]) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.getSelectedFacilityResources();

    })
  }

  public deleteCoreFactor(id: string | number): void {
    this.facilityService.deleteCoreFactor(this.selectedFacility['FacilityId'], id).subscribe((res: CoreFactor[]) => {
      this.coreFactors = res;
      this.getSelectedFacilityResources()
    })
  }

  public deleteRamFactor(id: string | number): void {
    this.facilityService.deleteRamFactor(this.selectedFacility['FacilityId'], id).subscribe((res: RamFactor[]) => {
      this.ramFactors = res;
      this.getSelectedFacilityResources()

    })
  }

  public getSelectedFacilityResources(): void {
    this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe((res: Resources[]) => {

                                                                                               this.resources = res;
                                                                                               this.isLoaded = true;
                                                                                             }
    )

  }

  public getRamCoreFactors(): void {
    forkJoin(
      this.facilityService.getCoreFactor(this.selectedFacility['FacilityId']),
      this.facilityService.getRamFactor(this.selectedFacility['FacilityId'])).subscribe((res: any) => {
      this.coreFactors = res[0];
      this.ramFactors = res[1];
    })

  }

  public tableToCSV(): void {
    this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

  }

  public tableToPDF(): void {
    const data: object = document.getElementById(this.tableId);
    html2canvas(data).then((canvas: any) => {
      // Few necessary setting options
      const imgWidth: number = 208;
      const pageHeight: number = 295;
      const imgHeight: number = canvas.height * imgWidth / canvas.width;
      const heightLeft: number = imgHeight;

      const contentDataURL: string = canvas.toDataURL('image/png');
      const pdf: jspdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position: number = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${this.selectedFacility['Facility']}.pdf`); // Generated PDF
    });
  }

}
