import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***FacilityService***REMOVED*** from "../../api-connector/facility.service";

import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';


@Component(***REMOVED***
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [FacilityService]

***REMOVED***)
export class ResourcesComponent implements OnInit ***REMOVED***

    public managerFacilities: [string, number][];
    /**
     * Chosen facility.
     */
    public selectedFacility: [string, number];

    isLoaded = false;

    simpleVmTotalRam = 0;
    simpleVmTotalCores = 0;
    simpleVmTotalVms = 0;
    simpleVmTotalVolumeLimit = 0;
    simpleVmTotalVolumeCounter = 0;

    openStackApprovedTotalRam = 0;
    openStackApprovedTotalCores = 0;
    openStackApprovedTotalVms = 0;
    openStackApprovedTotalVolumeLimit = 0;
    openStackApprovedTotalVolumeCounter = 0;
    openStackApprovedTotalObjectStorage = 0;
    openStackApprovedTotalFPGA = 0;
    openStackApprovedTotalGPU = 0;

    openStackWFCTotalRam = 0;
    openStackWFCTotalCores = 0;
    openStackWFCTotalVms = 0;
    openStackWFCTotalVolumeLimit = 0;
    openStackWFCTotalVolumeCounter = 0;
    openStackWFCTotalObjectStorage = 0;
    openStackWFCTotalFPGA = 0;
    openStackWFCTotalGPU = 0;
    totalRam = 0;
    totalCores = 0;
    totalVms = 0;
    totalVolumeLimit = 0;
    totalVolumeCounter = 0;
    totalObjectStorage = 0;
    totalFPGA = 0;
    totalGPU = 0;


    constructor(private  facilityService: FacilityService) ***REMOVED***
        this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getSelectedFacilityResources()


        ***REMOVED***)
    ***REMOVED***

    public getSelectedFacilityResources() ***REMOVED***
        this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe(res => ***REMOVED***
            this.simpleVmTotalRam = res['simpleVmApplications']['totalRam'];
            this.simpleVmTotalCores = res['simpleVmApplications']['totalCores'];
            this.simpleVmTotalVms = res['simpleVmApplications']['totalVms'];
            this.simpleVmTotalVolumeLimit = res['simpleVmApplications']['totalVolumeLimit'];
            this.simpleVmTotalVolumeCounter = res['simpleVmApplications']['totalVolumeCounter'];

            this.openStackApprovedTotalRam = res['approvedOpenStackApplications']['totalRam'];
            this.openStackApprovedTotalCores = res['approvedOpenStackApplications']['totalCores'];
            this.openStackApprovedTotalVms = res['approvedOpenStackApplications']['totalVms'];
            this.openStackApprovedTotalVolumeLimit = res['approvedOpenStackApplications']['totalVolumeLimit'];
            this.openStackApprovedTotalVolumeCounter = res['approvedOpenStackApplications']['totalVolumeCounter'];
            this.openStackApprovedTotalObjectStorage = res['approvedOpenStackApplications']['totalObjectStorage'];
            this.openStackApprovedTotalFPGA = res['approvedOpenStackApplications']['totalFPGA'];
            this.openStackApprovedTotalGPU = res['approvedOpenStackApplications']['totalGPU'];

            this.openStackWFCTotalRam = res['wfcOpenStackApplications']['totalRam'];
            this.openStackWFCTotalCores = res['wfcOpenStackApplications']['totalCores'];
            this.openStackWFCTotalVms = res['wfcOpenStackApplications']['totalVms'];
            this.openStackWFCTotalVolumeLimit = res['wfcOpenStackApplications']['totalVolumeLimit'];
            this.openStackWFCTotalVolumeCounter = res['wfcOpenStackApplications']['totalVolumeCounter'];
            this.openStackWFCTotalObjectStorage = res['wfcOpenStackApplications']['totalObjectStorage'];
            this.openStackWFCTotalFPGA = res['wfcOpenStackApplications']['totalFPGA'];
            this.openStackWFCTotalGPU = res['wfcOpenStackApplications']['totalGPU'];

            this.totalRam = res['total']['totalRam'];
            this.totalCores = res['total']['totalCores'];
            this.totalVms = res['total']['totalVms'];
            this.totalVolumeLimit = res['total']['totalVolumeLimit'];
            this.totalVolumeCounter = res['total']['totalVolumeCounter'];
            this.totalObjectStorage = res['total']['totalObjectStorage'];
            this.totalFPGA = res['total']['totalFPGA'];
            this.totalGPU = res['total']['totalGPU'];

            this.isLoaded = true;
        ***REMOVED***)

    ***REMOVED***


    public captureScreen() ***REMOVED***
        var data = document.getElementById('contentToConvert');
        html2canvas(data).then(canvas => ***REMOVED***
            // Few necessary setting options
            var imgWidth = 208;
            var pageHeight = 295;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png')
            let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            var position = 0;
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
