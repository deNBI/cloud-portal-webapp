import ***REMOVED*** Component ***REMOVED*** from '@angular/core';

@Component(***REMOVED***
  templateUrl: 'widgets.component.html'
***REMOVED***)
export class WidgetsComponent ***REMOVED***

  constructor() ***REMOVED*** ***REMOVED***

  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';

  // convert Hex to RGBA
  // public convertHex(hex: string, opacity: number)***REMOVED***
  //   hex = hex.replace('#','');
  //   let r = parseInt(hex.substring(0,2), 16);
  //   let g = parseInt(hex.substring(2,4), 16);
  //   let b = parseInt(hex.substring(4,6), 16);
  //
  //   let rgba = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  //   return rgba;
  // ***REMOVED***

  // events
  public chartClicked(e: any): void ***REMOVED***
    console.log(e);
  ***REMOVED***

  public chartHovered(e: any): void ***REMOVED***
    console.log(e);
  ***REMOVED***

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

  // lineChart4
  public lineChart4Data: Array<any> = [
    ***REMOVED***
      data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
      label: 'Series A'
    ***REMOVED***
  ];
  public lineChart4Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChart4Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false,
        points: false,
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
      ***REMOVED***]
    ***REMOVED***,
    elements: ***REMOVED*** point: ***REMOVED*** radius: 0 ***REMOVED*** ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public lineChart4Colours: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      borderWidth: 2
    ***REMOVED***
  ];
  public lineChart4Legend = false;
  public lineChart4Type = 'line';


  // barChart2
  public barChart2Data: Array<any> = [
    ***REMOVED***
      data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
      label: 'Series A'
    ***REMOVED***
  ];
  public barChart2Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChart2Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false,
        barPercentage: 0.6,
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
        ticks: ***REMOVED***
          beginAtZero: true,
        ***REMOVED***
      ***REMOVED***]
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public barChart2Colours: Array<any> = [
    ***REMOVED***
      backgroundColor: 'rgba(0,0,0,.2)',
      borderWidth: 0
    ***REMOVED***
  ];
  public barChart2Legend = false;
  public barChart2Type = 'bar';


  // barChart3
  public barChart3Data: Array<any> = [
    ***REMOVED***
      data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
      label: 'Series A'
    ***REMOVED***
  ];
  public barChart3Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChart3Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false
      ***REMOVED***]
    ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public barChart3Primary: Array<any> = [
    ***REMOVED***
      backgroundColor: this.brandPrimary,
      borderColor: 'transparent',
      borderWidth: 1
    ***REMOVED***
  ];
  public barChart3Danger: Array<any> = [
    ***REMOVED***
      backgroundColor: this.brandDanger,
      borderColor: 'transparent',
      borderWidth: 1
    ***REMOVED***
  ];
  public barChart3Success: Array<any> = [
    ***REMOVED***
      backgroundColor: this.brandSuccess,
      borderColor: 'transparent',
      borderWidth: 1
    ***REMOVED***
  ];
  public barChart3Legend = false;
  public barChart3Type = 'bar';


  // lineChart5
  public lineChart5Data: Array<any> = [
    ***REMOVED***
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    ***REMOVED***
  ];
  public lineChart5Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart5Options: any = ***REMOVED***
    maintainAspectRatio: false,
    scales: ***REMOVED***
      xAxes: [***REMOVED***
        display: false,
        points: false,
      ***REMOVED***],
      yAxes: [***REMOVED***
        display: false,
      ***REMOVED***]
    ***REMOVED***,
    elements: ***REMOVED*** point: ***REMOVED*** radius: 0 ***REMOVED*** ***REMOVED***,
    legend: ***REMOVED***
      display: false
    ***REMOVED***
  ***REMOVED***;
  public lineChart5Info: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      borderWidth: 2
    ***REMOVED***
  ];
  public lineChart5Success: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      borderWidth: 2
    ***REMOVED***
  ];
  public lineChart5Warning: Array<any> = [
    ***REMOVED***
      backgroundColor: 'transparent',
      borderColor: this.brandWarning,
      borderWidth: 2
    ***REMOVED***
  ];
  public lineChart5Legend = false;
  public lineChart5Type = 'line';

***REMOVED***
