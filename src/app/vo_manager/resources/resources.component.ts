import {Component, OnInit} from '@angular/core';
import {VoService} from '../../api-connector/vo.service';
import * as jspdf from 'jspdf';
import {Resources} from './resources';
import html2canvas from 'html2canvas';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as'

/**
 * Resource component.
 */
@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [VoService, ExportAsService]
})
export class ResourcesComponent implements OnInit {

    isLoaded: boolean = false;
    voResources: Resources[] = [];
    totalResource: Resources;
    fileName: string = 'VoResources';
    tableId: string = 'resourcesTable';
    today: number = Date.now();

    exportAsConfigCSV: ExportAsConfig = {
        type: 'csv',
        elementId: this.tableId
    };

    constructor(private voservice: VoService, private exportAsService: ExportAsService) {
        this.getVoProjectResources()

    }

    public tableToCSV(): void {
        this.exportAsService.save(this.exportAsConfigCSV, this.fileName);

    }

    public getVoProjectResources(): void {
        this.voservice.getVoProjectResources().subscribe(res => {
            for (const resp in res) {
                if (resp !== 'Total') {
                    const resource: Resources = new Resources(
                        resp, res[resp]['totalRam'], res[resp]['totalCores'],
                        res[resp]['totalVms'], res[resp]['totalVolumeLimit'], res[resp]['totalVolumeCounter'],
                        res[resp]['totalObjectStorage'], res[resp]['totalGPU']);
                    this.voResources.push(resource);
                } else {
                    this.totalResource = new Resources(
                        'Total', res['Total']['totalRam'], res['Total']['totalCores'],
                        res['Total']['totalVms'], res['Total']['totalVolumeLimit'],
                        res['Total']['totalVolumeCounter'], res['Total']['totalObjectStorage'],
                        res['Total']['totalGPU']);
                }
            }

            this.isLoaded = true;
        })

    }

    public tableToPDF(): void {
        const data = document.getElementById(this.tableId);
        html2canvas(data).then(canvas => {
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
        });
    }

    ngOnInit(): void {
    }

}
