import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***FacilityService***REMOVED*** from '../../api-connector/facility.service';
import ***REMOVED***Resources***REMOVED*** from '../../vo_manager/resources/resources';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import ***REMOVED***ExportAsConfig, ExportAsService***REMOVED*** from 'ngx-export-as'
import ***REMOVED***CoreFactor***REMOVED*** from './core-factor';
import ***REMOVED***RamFactor***REMOVED*** from './ram-factor';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';

/**
 * Facility resource component.
 */
@Component(***REMOVED***
             selector: 'app-resources',
             templateUrl: './resources.component.html',
             styleUrls: ['./resources.component.scss'],
             providers: [FacilityService, ExportAsService]

           ***REMOVED***)
export class ResourcesComponent implements OnInit ***REMOVED***

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
  exportAsConfigCSV: ExportAsConfig = ***REMOVED***
    type: 'csv',
    elementId: this.tableId
  ***REMOVED***;

  constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) ***REMOVED***
  ***REMOVED***

  addCoreFactor(cores: string | number, factor: string | number, description: string): void ***REMOVED***
    if (cores && factor) ***REMOVED***
      const re: any = /\,/gi;
      factor = factor.toString().replace(re, '.');
      this.facilityService.addCoresFactor(this.selectedFacility['FacilityId'], cores, factor, description)
        .subscribe((res: CoreFactor[]) => ***REMOVED***
          this.coreFactors = res;
          this.getSelectedFacilityResources()
        ***REMOVED***)
    ***REMOVED***
  ***REMOVED***

  addRamFactor(ram: string | number, factor: string | number, description: string): void ***REMOVED***
    if (ram && factor) ***REMOVED***
      const re: any = /\,/gi;
      factor = factor.toString().replace(re, '.');
      this.facilityService.addRamFactor(this.selectedFacility['FacilityId'], ram, factor, description).subscribe((res: RamFactor[]) => ***REMOVED***
        this.ramFactors = res;
        this.getSelectedFacilityResources()
      ***REMOVED***)
    ***REMOVED***
  ***REMOVED***

  onChangeSelectedFacility(): void ***REMOVED***
    this.getSelectedFacilityResources()
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.facilityService.getManagerFacilities().subscribe((result: [string, number][]) => ***REMOVED***
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.getSelectedFacilityResources();

    ***REMOVED***)
  ***REMOVED***

  public deleteCoreFactor(id: string | number): void ***REMOVED***
    this.facilityService.deleteCoreFactor(this.selectedFacility['FacilityId'], id).subscribe((res: CoreFactor[]) => ***REMOVED***
      this.coreFactors = res;
      this.getSelectedFacilityResources()
    ***REMOVED***)
  ***REMOVED***

  public deleteRamFactor(id: string | number): void ***REMOVED***
    this.facilityService.deleteRamFactor(this.selectedFacility['FacilityId'], id).subscribe((res: RamFactor[]) => ***REMOVED***
      this.ramFactors = res;
      this.getSelectedFacilityResources()

    ***REMOVED***)
  ***REMOVED***

  public getSelectedFacilityResources(): void ***REMOVED***
    this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe((res: Resources[]) => ***REMOVED***

                                                                                               this.resources = res;
                                                                                               this.isLoaded = true;
                                                                                             ***REMOVED***
    )

  ***REMOVED***

  public getRamCoreFactors(): void ***REMOVED***
    forkJoin(
      this.facilityService.getCoreFactor(this.selectedFacility['FacilityId']),
      this.facilityService.getRamFactor(this.selectedFacility['FacilityId'])).subscribe((res: any) => ***REMOVED***
      this.coreFactors = res[0];
      this.ramFactors = res[1];
    ***REMOVED***)

  ***REMOVED***

  public tableToCSV(): void ***REMOVED***
    this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

  ***REMOVED***

  public tableToPDF(): void ***REMOVED***
    const data: object = document.getElementById(this.tableId);
    html2canvas(data).then((canvas: any) => ***REMOVED***
      // Few necessary setting options
      const imgWidth: number = 208;
      const pageHeight: number = 295;
      const imgHeight: number = canvas.height * imgWidth / canvas.width;
      const heightLeft: number = imgHeight;

      const contentDataURL: string = canvas.toDataURL('image/png');
      const pdf: jspdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position: number = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`$***REMOVED***this.selectedFacility['Facility']***REMOVED***.pdf`); // Generated PDF
    ***REMOVED***);
  ***REMOVED***

***REMOVED***
