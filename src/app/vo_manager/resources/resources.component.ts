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

  title: string = 'VO Overview: Resources';

  isLoaded: boolean = false;
  voResources: Resources[] = [];
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
    this.voservice.getVoProjectResources().subscribe((res: Resources[]) => {
      this.voResources = res;
      this.isLoaded = true;
    })

  }

  public tableToPDF(): void {
    const data: any = document.getElementById(this.tableId);
    html2canvas(data).then((canvas: any) => {
      // Few necessary setting options
      const imgWidth: number = 208;
      const pageHeight: number = 295;
      const imgHeight: number = canvas.height * imgWidth / canvas.width;
      const heightLeft: number = imgHeight;

      const contentDataURL: string = canvas.toDataURL('image/png');
      const pdf: jspdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position: number = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('VoResources.pdf'); // Generated PDF
    });
  }

  ngOnInit(): void {
  }

}
