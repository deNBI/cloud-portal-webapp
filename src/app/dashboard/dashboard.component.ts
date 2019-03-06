import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';
import ***REMOVED*** Router ***REMOVED*** from '@angular/router';

@Component(***REMOVED***
  templateUrl: 'dashboard.component.html'
***REMOVED***)
export class DashboardComponent implements OnInit ***REMOVED***

  // constructor( ) ***REMOVED*** ***REMOVED***

  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';

  // dropdown buttons
  public status: ***REMOVED*** isopen ***REMOVED*** = ***REMOVED*** isopen: false ***REMOVED***;

  // lineChart1
  public lineChart1Data: Array<any> = [
    ***REMOVED***
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    ***REMOVED***
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        gridLines: ***REMOVED***
          color: 'transparent',
          zeroLineColor: 'transparent'
        ***REMOVED***,
        ticks: ***REMOVED***
          fontSize: 2,
          fontColor: 'transparent',
        ***REMOVED***

      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
        ticks: ***REMOVED***
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        ***REMOVED***
      ***REMOVED***],
    ***REMOVED***,
    elements: ***REMOVED***
      line: ***REMOVED***
        borderWidth: 1
      ***REMOVED***,
      point: ***REMOVED***
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      ***REMOVED***,
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public lineChart1Colours: Array<any> = [
    ***REMOVED*** // grey
      backgroundColor: this.brandPrimary,
      borderColor: 'rgba(255,255,255,.55)'
    ***REMOVED***
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    ***REMOVED***
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    ***REMOVED***
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        gridLines: ***REMOVED***
          color: 'transparent',
          zeroLineColor: 'transparent'
        ***REMOVED***,
        ticks: ***REMOVED***
          fontSize: 2,
          fontColor: 'transparent',
        ***REMOVED***

      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
        ticks: ***REMOVED***
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        ***REMOVED***
      ***REMOVED***],
    ***REMOVED***,
    elements: ***REMOVED***
      line: ***REMOVED***
        tension: 0.00001,
        borderWidth: 1
      ***REMOVED***,
      point: ***REMOVED***
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      ***REMOVED***,
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public lineChart2Colours: Array<any> = [
    ***REMOVED*** // grey
      backgroundColor: this.brandInfo,
      borderColor: 'rgba(255,255,255,.55)'
    ***REMOVED***
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    ***REMOVED***
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    ***REMOVED***
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false
      ***REMOVED***]
    ***REMOVED***,
    elements: ***REMOVED***
      line: ***REMOVED***
        borderWidth: 2
      ***REMOVED***,
      point: ***REMOVED***
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      ***REMOVED***,
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public lineChart3Colours: Array<any> = [
    ***REMOVED***
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    ***REMOVED***
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    ***REMOVED***
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A'
    ***REMOVED***
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false,
        barPercentage: 0.6,
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false
      ***REMOVED***]
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public barChart1Colours: Array<any> = [
    ***REMOVED***
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    ***REMOVED***
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    ***REMOVED***
      data: this.mainChartData1,
      label: 'Current'
    ***REMOVED***,
    ***REMOVED***
      data: this.mainChartData2,
      label: 'Previous'
    ***REMOVED***,
    ***REMOVED***
      data: this.mainChartData3,
      label: 'BEP'
    ***REMOVED***
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = ***REMOVED***
    responsive: true,
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        gridLines: ***REMOVED***
          drawOnChartArea: false,
        ***REMOVED***,
        ticks: ***REMOVED***
          callback: function(value: any) ***REMOVED***
            return value.charAt(0);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***],
      yAxes: [***REMOVED***
        ticks: ***REMOVED***
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        ***REMOVED***
      ***REMOVED***]
    ***REMOVED***,
    elements: ***REMOVED***
      line: ***REMOVED***
        borderWidth: 2
      ***REMOVED***,
      point: ***REMOVED***
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      ***REMOVED***
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public mainChartColours: Array<any> = [
    ***REMOVED*** // brandInfo
      backgroundColor: this.convertHex(this.brandInfo, 10),
      borderColor: this.brandInfo,
      pointHoverBackgroundColor: '#fff'
    ***REMOVED***,
    ***REMOVED*** // brandSuccess
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
      pointHoverBackgroundColor: '#fff'
    ***REMOVED***,
    ***REMOVED*** // brandDanger
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    ***REMOVED***
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public socialChartData1: Array<any> = [
    ***REMOVED***
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    ***REMOVED***
  ];
  public socialChartData2: Array<any> = [
    ***REMOVED***
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    ***REMOVED***
  ];
  public socialChartData3: Array<any> = [
    ***REMOVED***
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    ***REMOVED***
  ];
  public socialChartData4: Array<any> = [
    ***REMOVED***
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    ***REMOVED***
  ];

  public socialChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public socialChartOptions: any = ***REMOVED***
    responsive: true,
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false,
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
      ***REMOVED***]
    ***REMOVED***,
    elements: ***REMOVED***
      line: ***REMOVED***
        borderWidth: 2
      ***REMOVED***,
      point: ***REMOVED***
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      ***REMOVED***
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public socialChartColours: Array<any> = [
    ***REMOVED***
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    ***REMOVED***
  ];
  public socialChartLegend = false;
  public socialChartType = 'line';

  // sparkline charts

  public sparklineChartData1: Array<any> = [
    ***REMOVED***
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Clients'
    ***REMOVED***
  ];
  public sparklineChartData2: Array<any> = [
    ***REMOVED***
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Clients'
    ***REMOVED***
  ];

  public sparklineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public sparklineChartOptions: any = ***REMOVED***
    responsive: true,
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false,
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
      ***REMOVED***]
    ***REMOVED***,
    elements: ***REMOVED***
      line: ***REMOVED***
        borderWidth: 2
      ***REMOVED***,
      point: ***REMOVED***
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      ***REMOVED***
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public sparklineChartDefault: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: '#d1d4d7',
    ***REMOVED***
  ];
  public sparklineChartPrimary: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandPrimary,
    ***REMOVED***
  ];
  public sparklineChartInfo: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
    ***REMOVED***
  ];
  public sparklineChartDanger: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
    ***REMOVED***
  ];
  public sparklineChartWarning: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandWarning,
    ***REMOVED***
  ];
  public sparklineChartSuccess: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
    ***REMOVED***
  ];


  public sparklineChartLegend = false;
  public sparklineChartType = 'line';
  public toggleDropdown($event: MouseEvent): void ***REMOVED***
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  ***REMOVED***

  // convert Hex to RGBA
  public convertHex(hex: string, opacity: number) ***REMOVED***
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
    return rgba;
  ***REMOVED***

  // events
  public chartClicked(e: any): void ***REMOVED***
    console.log(e);
  ***REMOVED***

  public chartHovered(e: any): void ***REMOVED***
    console.log(e);
  ***REMOVED***

  // mainChart

  public random(min: number, max: number) ***REMOVED***
    return Math.floor(Math.random() * (max - min + 1) + min);
  ***REMOVED***


  ngOnInit(): void ***REMOVED***
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) ***REMOVED***
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
