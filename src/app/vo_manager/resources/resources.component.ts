import {Component, OnInit} from '@angular/core';
import {VoService} from '../../api-connector/vo.service';
import {FacilityService} from '../../api-connector/facility.service';
import * as jspdf from 'jspdf';
import {Resources} from './resources';
import html2canvas from 'html2canvas';
import {ExportAsService, ExportAsConfig} from 'ngx-export-as'

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [VoService, ExportAsService]
})
export class ResourcesComponent implements OnInit {

    isLoaded = false;
    voResources: Resources[] = [];
    totalResource: Resources;
    fileName = 'VoResources';
    tableId = 'resourcesTable';
    today: number = Date.now();


    exportAsConfigCSV: ExportAsConfig = {
        type: 'csv',
        elementId: this.tableId
    };

    constructor(private voservice: VoService, private exportAsService: ExportAsService) {
        this.getVoProjectResources()

    }

    public tableToCSV() {
        this.exportAsService.save(this.exportAsConfigCSV, this.fileName);

    }


    public getVoProjectResources() {
        this.voservice.getVoProjectResources().subscribe(res => {
            for (const r in res) {
                if (r != 'Total') {
                    const resource = new Resources(r, res[r]['totalRam'], res[r]['totalCores'],
                        res[r]['totalVms'], res[r]['totalVolumeLimit'], res[r]['totalVolumeCounter'],
                        res[r]['totalObjectStorage'], res[r]['totalFPGA'], res[r]['totalGPU']);
                    this.voResources.push(resource);
                } else {
                    this.totalResource = new Resources('Total', res['Total']['totalRam'], res['Total']['totalCores'], res['Total']['totalVms'], res['Total']['totalVolumeLimit'],
                        res['Total']['totalVolumeCounter'], res['Total']['totalObjectStorage'], res['Total']['totalFPGA'], res['Total']['totalGPU']);
                }
            }


            this.isLoaded = true;
        })

    }


    public tableToPDF() {
        const data = document.getElementById(this.tableId);
        html2canvas(data).then(canvas => {
            // Few necessary setting options
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png')
            const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save('VoResources.pdf'); // Generated PDF
        });
    }


    ngOnInit() {
    }


}
