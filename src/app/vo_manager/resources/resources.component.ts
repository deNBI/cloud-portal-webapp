import {Component, OnInit} from '@angular/core';
import {VoService} from "../../api-connector/vo.service";
import {FacilityService} from "../../api-connector/facility.service";
import * as jspdf from 'jspdf';
import {Resources} from "./resources";
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [VoService]
})
export class ResourcesComponent implements OnInit {

    isLoaded = false;
    voResources: Resources[] = [];
    totalResource: Resources;


    constructor(private voservice: VoService) {
        this.getVoProjectResources()

    }

    public getVoProjectResources() {
        this.voservice.getVoProjectResources().subscribe(res => {
            for (let r in res) {
                if (r != 'Total') {
                    let resource = new Resources(r, res[r]['totalRam'], res[r]['totalCores'],
                        res[r]['totalVms'], res[r]['totalVolumeLimit'], res[r]['totalVolumeCounter'],
                        res[r]['totalObjectStorage'], res[r]['totalFPGA'], res[r]['totalGPU']);
                    this.voResources.push(resource);
                }
                else {
                    this.totalResource = new Resources('Total', res['Total']['totalRam'], res['Total']['totalCores'], res['Total']['totalVms'], res['Total']['totalVolumeLimit'],
                        res['Total']['totalVolumeCounter'], res['Total']['totalObjectStorage'], res['Total']['totalFPGA'], res['Total']['totalGPU']);
                }
                console.log(this.voResources)
            }


            this.isLoaded = true;
        })

    }


    public captureScreen() {
        var data = document.getElementById('contentToConvert');
        html2canvas(data).then(canvas => {
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
        });
    }


    ngOnInit() {
    }


}
