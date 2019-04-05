import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***FacilityService***REMOVED*** from '../../api-connector/facility.service';
import ***REMOVED***Resources***REMOVED*** from '../../vo_manager/resources/resources';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import ***REMOVED***ExportAsConfig, ExportAsService***REMOVED*** from 'ngx-export-as'
import ***REMOVED***CoreFactor***REMOVED*** from "./core-factor";
import ***REMOVED***RamFactor***REMOVED*** from "./ram-factor";
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';

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

    tableId: string = 'contentToConvert';
    today: number = Date.now();
    coreFactors: CoreFactor[] = [];
    ramFactors: RamFactor[] = [];
    exportAsConfigCSV: ExportAsConfig = ***REMOVED***
        type: 'csv',
        elementId: this.tableId
    ***REMOVED***;


    constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) ***REMOVED***
        this.facilityService.getManagerFacilities().subscribe((result: [string, number][]) => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getSelectedFacilityResources();

        ***REMOVED***)
    ***REMOVED***

    public tableToCSV(): void ***REMOVED***
        this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

    ***REMOVED***


    public deleteCoreFactor(id: string | number): void ***REMOVED***
        this.facilityService.deleteCoreFactor(this.selectedFacility['FacilityId'], id).subscribe((res: CoreFactor[]) => ***REMOVED***
            this.coreFactors = res;
        ***REMOVED***)
    ***REMOVED***

    public deleteRamFactor(id: string | number): void ***REMOVED***
        this.facilityService.deleteRamFactor(this.selectedFacility['FacilityId'], id).subscribe((res: RamFactor[]) => ***REMOVED***
            this.ramFactors = res;
        ***REMOVED***)
    ***REMOVED***

    public getRamCoreFactors(): void ***REMOVED***
        forkJoin(
            this.facilityService.getCoreFactor(this.selectedFacility['FacilityId']),
            this.facilityService.getRamFactor(this.selectedFacility['FacilityId'])).subscribe(res => ***REMOVED***
            this.coreFactors = res[0];
            this.ramFactors = res[1];
        ***REMOVED***)

    ***REMOVED***


    public getSelectedFacilityResources(): void ***REMOVED***
        this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe((res: Resources[]) => ***REMOVED***

                this.resources = res;
                this.isLoaded = true;
            ***REMOVED***
        )

    ***REMOVED***

    addCoreFactor(cores: string | number, factor: string | number): void ***REMOVED***
        this.facilityService.addCoresFactor(this.selectedFacility['FacilityId'], cores, factor).subscribe(res => ***REMOVED***
            this.coreFactors = res;
        ***REMOVED***)
    ***REMOVED***

    addRamFactor(ram: string | number, factor: string | number): void ***REMOVED***
        this.facilityService.addRamFactor(this.selectedFacility['FacilityId'], ram, factor).subscribe(res => ***REMOVED***
            this.ramFactors = res;
        ***REMOVED***)
    ***REMOVED***

    public tableToPDF(): void ***REMOVED***
        const data: object = document.getElementById(this.tableId);
        html2canvas(data).then(canvas => ***REMOVED***
            // Few necessary setting options
            const imgWidth: number = 208;
            const pageHeight: number = 295;
            const imgHeight: number = canvas.height * imgWidth / canvas.width;
            const heightLeft: number = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save(this.selectedFacility['Facility'] + '.pdf'); // Generated PDF
        ***REMOVED***);
    ***REMOVED***

    onChangeSelectedFacility(value): void ***REMOVED***
        this.getSelectedFacilityResources()
    ***REMOVED***

    ngOnInit() ***REMOVED***
    ***REMOVED***

***REMOVED***
