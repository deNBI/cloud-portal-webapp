import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {is_vo} from '../../shared/globalvar';
import * as d3 from 'd3';
import {NumbersService} from '../../api-connector/numbers.service';
import * as c3 from 'c3';
import {jsPDF} from 'jspdf';
import * as saveSVG from 'save-svg-as-png';
import 'svg2pdf.js';
import {domtoimage} from 'dom-to-image';

import html2canvas from 'html2canvas';

/**
 * Component to display graphs which illustrate numbers for VO.
 */
@Component({
  selector: 'app-number-charts',
  templateUrl: './number-charts.component.html',
  styleUrls: ['./number-charts.component.css'],
  providers: [NumbersService]

})

export class NumberChartsComponent implements OnInit {

  is_vo_admin: boolean = true;
  title: string = 'Cloud Numbers';
  constructor(private numbersService: NumbersService) {

  }

  /**
   * Lists for numbers of projects per project type and status.
   */
  private runningOpenstack: any[] = ['OpenStack running'];
  private runningSimpleVM: any[] = ['SimpleVM running'];
  private terminatedOpenstack: any[] = ['OpenStack terminated'];
  private terminatedSimpleVM: any[] = ['SimpleVM terminated'];
  private endDatesProjects: any[] = ['x'];

  /**
   * Lists for ram and cores numbers.
   */

  private simpleVMRam: any[] = ['RAM SimpleVM'];
  private simpleVMCores: any[] = ['Cores SimpleVM'];
  private openstackRam: any [] = ['RAM OpenStack'];
  private openstackCores: any[] = ['Cores Openstack'];
  private endDatesResources: any[] = ['x'];

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
        this.endDatesProjects.push(valuePack["end_date"]);
      });
      this.drawProjectNumbersChart();

    }, (err: Error) => {
      console.log(err);
      });

    this.numbersService.getRamCoresTimeline().subscribe(
      (result: Object[]): void => {

        result.forEach((valuePack: Object): void => {
          this.openstackCores.push(valuePack["openstack_cores"]);
          this.openstackRam.push(valuePack["openstack_ram"]);
          this.simpleVMCores.push(valuePack["simple_vm_cores"]);
          this.simpleVMRam.push(valuePack["simple_vm_ram"]);
          this.endDatesResources.push(valuePack["end_date"]);
        });
        this.drawRamNumbersChart();
        this.drawCoresNumbersChart();
      }, (err: Error) => {
        console.log(err);
      }
    );
  }

  /**
   * Downloads the chart as a PDF-File - currently not in use
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
   * Downloads the numbers graphic as a png.
   */
  downloadAsPNG(elementId: string, filename: string): void {
    saveSVG.saveSvgAsPng(document.getElementById(elementId), filename);

  }


  /**
   * Maybe refactor, so only one function is necessary and independent from chart to draw.
   * Draws the cores Chart into the template.
   */
  drawCoresNumbersChart(): void {
    const coresChart: any  = c3.generate({
      oninit: function() {
        this.svg.attr('id', 'coresNumbersSVG')
      },
      bindto: '#coresChart',
      size: {
        height: 600
      }, data: {
        x : 'x',
        columns: [
          this.endDatesResources,
          this.simpleVMCores,
          this.openstackCores
        ],
        type: 'bar',
        bar: {
          width: {
            ratio: 0.2
          }
        },
        groups: [
          [
            this.simpleVMCores[0],
            this.openstackCores[0]
          ]
        ],
        order: null
      },

      color: {
        pattern: ['#00adef', '#ed1944']
      },
      grid: {
        y: {
          show: true
        }
      },
      axis: {
        x: {
          label: {
            text: 'Date',
            position: 'outer-right'
          },
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        },
        y: {
          label: {
            text: 'Amount of allocated cores',
            position: 'outer-right'
          }
        }
      }
    });
  }

  /**
   * Maybe refactor, so only one function is necessary and independent from chart to draw.
   * Draws the ram Chart into the template.
   */
  drawRamNumbersChart(): void {
    const ramChart: any  = c3.generate({
      oninit: function() {
        this.svg.attr('id', 'ramNumbersSVG')
      },
      bindto: '#ramChart',
      size: {
        height: 600
      }, data: {
        x : 'x',
        columns: [
          this.endDatesResources,
          this.simpleVMRam,
          this.openstackRam
        ],
        type: 'bar',
        bar: {
          width: {
            ratio: 0.2
          }
        },
        groups: [
          [
            this.simpleVMRam[0],
            this.openstackRam[0]
          ]
        ],
        order: null
      },

      color: {
        pattern: ['#00adef', '#ed1944']
      },
      grid: {
        y: {
          show: true
        }
      },
      axis: {
        x: {
          label: {
            text: 'Date',
            position: 'outer-right'
          },
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        },
        y: {
          label: {
            text: 'Amount of allocated VRAM in GB',
            position: 'outer-right'
          }
        }
      }
    });
  }


  /**
   * Draws the project numbers chart in the template.
   */
  drawProjectNumbersChart(): void {

    const projectNumbersChart: any  = c3.generate({
      oninit: function() {
        this.svg.attr('id', 'projectNumbersSVG')
      },
      bindto: '#projectsChart',
      size: {
        height: 600
      }, data: {
        x : 'x',
        columns: [
          this.endDatesProjects,
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
          show: true
        }
      },
      axis: {
        x: {
          label: {
            text: 'Date',
            position: 'outer-right'
          },
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        },
        y: {
          label: {
        text: 'Number of projects',
        position: 'outer-right'
          }
        }
      }
    });

  }
}
