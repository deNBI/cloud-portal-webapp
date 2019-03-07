import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***FacilityService***REMOVED*** from '../../api-connector/facility.service';
import ***REMOVED***Resources***REMOVED*** from '../../vo_manager/resources/resources';
import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';
import ***REMOVED***ExportAsConfig, ExportAsService***REMOVED*** from 'ngx-export-as'


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

    isLoaded = false;
    simpleVmRessource: Resources;
    openstackWFCResources: Resources;
    openstackApprovedResources: Resources;
    totalResource: Resources;
    tableId = 'contentToConvert';
    today: number = Date.now();


    exportAsConfigCSV: ExportAsConfig = ***REMOVED***
        type: 'csv',
        elementId: this.tableId
    ***REMOVED***;

    public tableToCSV() ***REMOVED***
        this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

    ***REMOVED***


    constructor(private  facilityService: FacilityService, private exportAsService: ExportAsService) ***REMOVED***
        this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getSelectedFacilityResources()


        ***REMOVED***)
    ***REMOVED***

    public getSelectedFacilityResources() ***REMOVED***
        this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe(res => ***REMOVED***
                this.simpleVmRessource = new Resources('Simple VM', res['simpleVmApplications']['totalRam'],
                    res['simpleVmApplications']['totalCores'],
                    res['simpleVmApplications']['totalVms'], res['simpleVmApplications']['totalVolumeLimit'],
                    res['simpleVmApplications']['totalVolumeCounter'], 0, 0, 0);
                this.openstackApprovedResources = new Resources('Approved OpenStack', res['approvedOpenStackApplications']['totalRam'],
                    res['approvedOpenStackApplications']['totalCores'],
                    res['approvedOpenStackApplications']['totalVms'], res['approvedOpenStackApplications']['totalVolumeLimit'],
                    res['approvedOpenStackApplications']['totalVolumeCounter'],
                    res['approvedOpenStackApplications']['totalObjectStorage'], res['approvedOpenStackApplications']['totalFPGA'],
                    res['approvedOpenStackApplications']['totalGPU']);
                this.openstackWFCResources = new Resources('Wait for Confirmation OpenStack', res['wfcOpenStackApplications']['totalRam'],
                    res['wfcOpenStackApplications']['totalCores'],
                    res['wfcOpenStackApplications']['totalVms'], res['wfcOpenStackApplications']['totalVolumeLimit'],
                    res['wfcOpenStackApplications']['totalVolumeCounter'],
                    res['wfcOpenStackApplications']['totalObjectStorage'], res['wfcOpenStackApplications']['totalFPGA'],
                    res['wfcOpenStackApplications']['totalGPU'])
                this.totalResource = new Resources('Total', res['total']['totalRam'], res['total']['totalCores'],
                    res['total']['totalVms'], res['total']['totalVolumeLimit'],
                    res['total']['totalVolumeCounter'], res['total']['totalObjectStorage'],
                    res['total']['totalFPGA'], res['total']['totalGPU']);

                this.isLoaded = true;
            ***REMOVED***
        )

    ***REMOVED***


    public tableToPDF() ***REMOVED***
        const data = document.getElementById(this.tableId);
        html2canvas(data).then(canvas => ***REMOVED***
            // Few necessary setting options
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png')
            const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save(this.selectedFacility['Facility'] + '.pdf'); // Generated PDF
        ***REMOVED***);
    ***REMOVED***


    onChangeSelectedFacility(value) ***REMOVED***
        this.getSelectedFacilityResources()
    ***REMOVED***

    ngOnInit() ***REMOVED***
    ***REMOVED***


***REMOVED***
