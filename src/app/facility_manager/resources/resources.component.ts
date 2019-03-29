import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../../api-connector/facility.service';
import {Resources} from '../../vo_manager/resources/resources';
import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as'

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
    simpleVmRessource: Resources;
    openstackWFCResources: Resources;
    openstackApprovedResources: Resources;
    totalResource: Resources;
    tableId: string = 'contentToConvert';
    today: number = Date.now();

    exportAsConfigCSV: ExportAsConfig = {
        type: 'csv',
        elementId: this.tableId
    };

    public tableToCSV(): void {
        this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

    }

    constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) {
        this.facilityService.getManagerFacilities().subscribe((result: [string, number][]) => {
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getSelectedFacilityResources()

        })
    }

    public getSelectedFacilityResources(): void {
        this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe((res: object) => {
                this.simpleVmRessource = new Resources(
                    'Simple VM',
                    res['simpleVmApplications']['totalRam'],
                    res['simpleVmApplications']['totalCores'],
                    res['simpleVmApplications']['totalVms'], res['simpleVmApplications']['totalVolumeLimit'],
                    res['simpleVmApplications']['totalVolumeCounter'], 0, res['simpleVmApplications']['totalGPU']);
                this.openstackApprovedResources = new Resources(
                    'Approved OpenStack',
                    res['approvedOpenStackApplications']['totalRam'],
                    res['approvedOpenStackApplications']['totalCores'],
                    res['approvedOpenStackApplications']['totalVms'], res['approvedOpenStackApplications']['totalVolumeLimit'],
                    res['approvedOpenStackApplications']['totalVolumeCounter'],
                    res['approvedOpenStackApplications']['totalObjectStorage'],
                    res['approvedOpenStackApplications']['totalGPU']);
                this.openstackWFCResources = new Resources(
                    'Wait for Confirmation OpenStack',
                    res['wfcOpenStackApplications']['totalRam'],
                    res['wfcOpenStackApplications']['totalCores'],
                    res['wfcOpenStackApplications']['totalVms'], res['wfcOpenStackApplications']['totalVolumeLimit'],
                    res['wfcOpenStackApplications']['totalVolumeCounter'],
                    res['wfcOpenStackApplications']['totalObjectStorage'],
                    res['wfcOpenStackApplications']['totalGPU']);
                this.totalResource = new Resources(
                    'Total',
                    res['total']['totalRam'], res['total']['totalCores'],
                    res['total']['totalVms'], res['total']['totalVolumeLimit'],
                    res['total']['totalVolumeCounter'], res['total']['totalObjectStorage'],
                    res['total']['totalGPU']);

                this.isLoaded = true;
            }
        )

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
