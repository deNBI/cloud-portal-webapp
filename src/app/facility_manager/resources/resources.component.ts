import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../../api-connector/facility.service';
import {Resources} from '../../vo_manager/resources/resources';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as'
import {CoreFactor} from "./core-factor";
import {RamFactor} from "./ram-factor";
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [FacilityService, ExportAsService]

})
export class ResourcesComponent implements OnInit {

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
    exportAsConfigCSV: ExportAsConfig = {
        type: 'csv',
        elementId: this.tableId
    };


    constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) {
        this.facilityService.getManagerFacilities().subscribe((result: [string, number][]) => {
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getSelectedFacilityResources();

        })
    }

    public tableToCSV(): void {
        this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

    }


    public deleteCoreFactor(id: string | number): void {
        this.facilityService.deleteCoreFactor(this.selectedFacility['FacilityId'], id).subscribe((res: CoreFactor[]) => {
            this.coreFactors = res;
        })
    }

    public deleteRamFactor(id: string | number): void {
        this.facilityService.deleteRamFactor(this.selectedFacility['FacilityId'], id).subscribe((res: RamFactor[]) => {
            this.ramFactors = res;
        })
    }

    public getRamCoreFactors(): void {
        forkJoin(
            this.facilityService.getCoreFactor(this.selectedFacility['FacilityId']),
            this.facilityService.getRamFactor(this.selectedFacility['FacilityId'])).subscribe(res => {
            this.coreFactors = res[0];
            this.ramFactors = res[1];
        })

    }


    public getSelectedFacilityResources(): void {
        this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe((res: Resources[]) => {

                this.resources = res;
                this.isLoaded = true;
            }
        )

    }

    addCoreFactor(cores: string | number, factor: string | number): void {
        if (cores && factor) {
            let re = /\,/gi;
            factor = factor.toString().replace(re, '.');
            this.facilityService.addCoresFactor(this.selectedFacility['FacilityId'], cores, factor).subscribe(res => {
                this.coreFactors = res;
            })
        }
    }

    addRamFactor(ram: string | number, factor: string | number): void {
        if (ram && factor) {
            let re = /\,/gi;
            factor = factor.toString().replace(re, '.');
            this.facilityService.addRamFactor(this.selectedFacility['FacilityId'], ram, factor).subscribe(res => {
                this.ramFactors = res;
            })
        }
    }

    public tableToPDF(): void {
        const data: object = document.getElementById(this.tableId);
        html2canvas(data).then(canvas => {
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
        });
    }

    onChangeSelectedFacility(value): void {
        this.getSelectedFacilityResources()
    }

    ngOnInit() {
    }

}
