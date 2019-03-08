import ***REMOVED*** Component ***REMOVED*** from '@angular/core';

@Component(***REMOVED***
  templateUrl: 'chartjs.component.html'
***REMOVED***)
export class ChartJSComponent ***REMOVED***

  // lineChart
  public lineChartData: any[] = [
    ***REMOVED***data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'***REMOVED***,
    ***REMOVED***data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'***REMOVED***,
    ***REMOVED***data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'***REMOVED***
  ];
  public lineChartLabels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = ***REMOVED***
    animation: false,
    responsive: true
  ***REMOVED***;
  public lineChartColours: any[] = [
    ***REMOVED*** // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    ***REMOVED***,
    ***REMOVED*** // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    ***REMOVED***,
    ***REMOVED*** // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    ***REMOVED***
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // barChart
  public barChartOptions: any = ***REMOVED***
    scaleShowVerticalLines: false,
    responsive: true
  ***REMOVED***;
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    ***REMOVED***data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'***REMOVED***,
    ***REMOVED***data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'***REMOVED***
  ];

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';

  // Radar
  public radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartData: any = [
    ***REMOVED***data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'***REMOVED***,
    ***REMOVED***data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'***REMOVED***
  ];
  public radarChartType = 'radar';

  // Pie
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = 'pie';

  // PolarArea
  public polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
  public polarAreaLegend = true;

  public polarAreaChartType = 'polarArea';

  // events
  public chartClicked(e: any): void ***REMOVED***
    console.log(e);
  ***REMOVED***

  public chartHovered(e: any): void ***REMOVED***
    console.log(e);
  ***REMOVED***

***REMOVED***
