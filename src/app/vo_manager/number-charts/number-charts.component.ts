import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {is_vo} from "../../shared/globalvar";
import * as d3 from 'd3';
import {NumbersService} from "../../api-connector/numbers.service";
import * as c3 from 'c3';


@Component({
  selector: 'app-number-charts',
  templateUrl: './number-charts.component.html',
  styleUrls: ['./number-charts.component.css'],
  providers: [NumbersService],

})




/**
 *  Class for presentation of charts as svg.
 *  TODO: add svg download possibility
 */
export class NumberChartsComponent implements OnInit {

  isLoaded: boolean = true;
  is_vo_admin: boolean = true;
  constructor(private numbersService: NumbersService) {

  }



  private runningOpenstack = ['OS running'];
  private runningSimpleVM = ['SVM running'];
  private terminatedOpenstack = ['OS terminated'];
  private terminatedSimpleVM = ['SVM terminated'];
  private endDates = ['x'];


  ngOnInit(): void {
    this.getData();
  }





  getData(): void {
    this.numbersService.getProjectCounterTimeline().subscribe(
    (result: Object[]): void => {
      result.forEach((valuePack: any) => {
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



  drawChart(): void {
   let chart = c3.generate({
    bindto: '#chart',
     size: {
       height: 600
     },
    data: {
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
        label: 'Number of machines'
      }
     }
  });





  }

}
