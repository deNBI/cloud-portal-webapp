import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {is_vo} from "../../shared/globalvar";
import * as d3 from 'd3';
import {NumbersService} from "../../api-connector/numbers.service";
import * as c3 from 'c3';
import {jsPDF} from 'jspdf';
import 'svg2pdf.js'
import html2canvas from "html2canvas";


/**
 * Component to display graphs which illustrate numbers for VO.
 */
@Component({
  selector: 'app-number-charts',
  templateUrl: './number-charts.component.html',
  styleUrls: ['./number-charts.component.css'],
  providers: [NumbersService],

})


export class NumberChartsComponent implements OnInit {

  is_vo_admin: boolean = true;
  title: string = 'Cloud Numbers';
  constructor(private numbersService: NumbersService) {

  }

  /**
   * Lists for numbers of projects per project type and status.
   */
  private runningOpenstack: any[] = ['OS running'];
  private runningSimpleVM: any[] = ['SVM running'];
  private terminatedOpenstack: any[] = ['OS terminated'];
  private terminatedSimpleVM: any[] = ['SVM terminated'];
  private endDates: any[] = ['x'];


  ngOnInit(): void {
    this.getData();
  }

  /**
   * Gets the Data from the API and separates it into the lists.
   */
  getData(): void {
    /* tslint:disable */
    this.numbersService.getProjectCounterTimeline().subscribe(
    (result: Object[]): void => {
      result.forEach((valuePack: any): void => {
        this.runningOpenstack.push(valuePack["running_openstack"]);
        this.runningSimpleVM.push(valuePack["running_simple_vm"]);
        this.terminatedOpenstack.push(valuePack["terminated_openstack"]);
        this.terminatedSimpleVM.push(valuePack["terminated_simple_vm"]);
        this.endDates.push(valuePack["end_date"]);
      });
      this.drawChart();

    }, (err: Error) => {
      console.log(err);
      });
  }

  /**
   * Downloads the chart as a PDF-File
   */
  downloadAsPDF(): void {
    html2canvas(document.getElementById('chart')).then((canvas: HTMLCanvasElement): void => {
      // Few necessary setting options
      const imgWidth: number = 208;
      const pageHeight: number = 295;
      const imgHeight: number = canvas.height * imgWidth / canvas.width;
      const heightLeft: number = imgHeight;

      const contentDataURL: string = canvas.toDataURL('image/png');
      const pdf: jsPDF = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position: number = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('VoResources.pdf'); // Generated PDF
    }).catch((): void => {
      console.log('failed to convert to pdf')
    });
  }





  /**
   * Draws the chart in the template.
   */
  drawChart(): void {

    const chart: any  = c3.generate({
      oninit: function() {
        this.svg.attr('id', 'numberChartSVG')
      },
      bindto: '#chart',
      size: {
        height: 600
      }, data: {
        x : 'x',
        columns: [
          this.endDates,
          this.runningSimpleVM,
          this.terminatedSimpleVM,
          this.runningOpenstack,
          this.terminatedOpenstack
        ],
        type: 'bar',
        bar: {
          width: {
            ratio: 0.2
          }
        },
        groups: [
          [
            this.runningSimpleVM[0],
            this.terminatedSimpleVM[0],
            this.runningOpenstack[0],
            this.terminatedOpenstack[0]
          ]
        ],
        order: null
      },

      color: {
        pattern: ['#00adef', '#007AAB', '#ed1944', '#8F1331']
      },
      grid: {
        y: {
          lines: [{value:0}]
        }
      },
      axis: {
        x: {
          label: 'Date',
          position: 'outer-right',
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        },
        y: {
          label: 'Number of projects'
        }
      }
    });

  }
}
