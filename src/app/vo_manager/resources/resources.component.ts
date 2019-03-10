import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from '../../api-connector/vo.service';
import * as jspdf from 'jspdf';
import ***REMOVED***Resources***REMOVED*** from './resources';
import html2canvas from 'html2canvas';
import ***REMOVED***ExportAsConfig, ExportAsService***REMOVED*** from 'ngx-export-as'

/**
 * Resource component.
 */
@Component(***REMOVED***
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [VoService, ExportAsService]
***REMOVED***)
export class ResourcesComponent implements OnInit ***REMOVED***

    isLoaded: boolean = false;
    voResources: Resources[] = [];
    totalResource: Resources;
    fileName: string = 'VoResources';
    tableId: string = 'resourcesTable';
    today: number = Date.now();

    exportAsConfigCSV: ExportAsConfig = ***REMOVED***
        type: 'csv',
        elementId: this.tableId
    ***REMOVED***;

    constructor(private voservice: VoService, private exportAsService: ExportAsService) ***REMOVED***
        this.getVoProjectResources()

    ***REMOVED***

    public tableToCSV(): void ***REMOVED***
        this.exportAsService.save(this.exportAsConfigCSV, this.fileName);

    ***REMOVED***

    public getVoProjectResources(): void ***REMOVED***
        this.voservice.getVoProjectResources().subscribe(res => ***REMOVED***
            for (const resp in res) ***REMOVED***
                if (resp !== 'Total') ***REMOVED***
                    const resource: Resources = new Resources(
                        resp, res[resp]['totalRam'], res[resp]['totalCores'],
                        res[resp]['totalVms'], res[resp]['totalVolumeLimit'], res[resp]['totalVolumeCounter'],
                        res[resp]['totalObjectStorage'], res[resp]['totalFPGA'], res[resp]['totalGPU']);
                    this.voResources.push(resource);
                ***REMOVED*** else ***REMOVED***
                    this.totalResource = new Resources(
                        'Total', res['Total']['totalRam'], res['Total']['totalCores'],
                        res['Total']['totalVms'], res['Total']['totalVolumeLimit'],
                        res['Total']['totalVolumeCounter'], res['Total']['totalObjectStorage'],
                        res['Total']['totalFPGA'], res['Total']['totalGPU']);
                ***REMOVED***
            ***REMOVED***

            this.isLoaded = true;
        ***REMOVED***)

    ***REMOVED***

    public tableToPDF(): void ***REMOVED***
        const data = document.getElementById(this.tableId);
        html2canvas(data).then(canvas => ***REMOVED***
            // Few necessary setting options
            const imgWidth: number = 208;
            const pageHeight: number = 295;
            const imgHeight: number = canvas.height * imgWidth / canvas.width;
            const heightLeft: number = imgHeight;

            const contentDataURL: string = canvas.toDataURL('image/png');
            const pdf: jspdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            const position: number = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save('VoResources.pdf'); // Generated PDF
        ***REMOVED***);
    ***REMOVED***

    ngOnInit(): void ***REMOVED***
    ***REMOVED***

***REMOVED***
