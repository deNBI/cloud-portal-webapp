import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from "../../api-connector/vo.service";
import ***REMOVED***FacilityService***REMOVED*** from "../../api-connector/facility.service";
import * as jspdf from 'jspdf';
import ***REMOVED***Resources***REMOVED*** from "./resources";
import html2canvas from 'html2canvas';
import ***REMOVED***ExportAsService, ExportAsConfig***REMOVED*** from 'ngx-export-as'

@Component(***REMOVED***
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [VoService, ExportAsService]
***REMOVED***)
export class ResourcesComponent implements OnInit ***REMOVED***

    isLoaded = false;
    voResources: Resources[] = [];
    totalResource: Resources;
    fileName = 'VoResources';
    tableId = 'resourcesTable';
    today: number = Date.now();


    exportAsConfigCSV: ExportAsConfig = ***REMOVED***
        type: 'csv',
        elementId: this.tableId
    ***REMOVED***;

    constructor(private voservice: VoService, private exportAsService: ExportAsService) ***REMOVED***
        this.getVoProjectResources()

    ***REMOVED***

    public tableToCSV() ***REMOVED***
        this.exportAsService.save(this.exportAsConfigCSV, this.fileName);

    ***REMOVED***


    public getVoProjectResources() ***REMOVED***
        this.voservice.getVoProjectResources().subscribe(res => ***REMOVED***
            for (let r in res) ***REMOVED***
                if (r != 'Total') ***REMOVED***
                    let resource = new Resources(r, res[r]['totalRam'], res[r]['totalCores'],
                        res[r]['totalVms'], res[r]['totalVolumeLimit'], res[r]['totalVolumeCounter'],
                        res[r]['totalObjectStorage'], res[r]['totalFPGA'], res[r]['totalGPU']);
                    this.voResources.push(resource);
                ***REMOVED***
                else ***REMOVED***
                    this.totalResource = new Resources('Total', res['Total']['totalRam'], res['Total']['totalCores'], res['Total']['totalVms'], res['Total']['totalVolumeLimit'],
                        res['Total']['totalVolumeCounter'], res['Total']['totalObjectStorage'], res['Total']['totalFPGA'], res['Total']['totalGPU']);
                ***REMOVED***
            ***REMOVED***


            this.isLoaded = true;
        ***REMOVED***)

    ***REMOVED***


    public tableToPDF() ***REMOVED***
        var data = document.getElementById(this.tableId);
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
            pdf.save('VoResources.pdf'); // Generated PDF
        ***REMOVED***);
    ***REMOVED***


    ngOnInit() ***REMOVED***
    ***REMOVED***


***REMOVED***
