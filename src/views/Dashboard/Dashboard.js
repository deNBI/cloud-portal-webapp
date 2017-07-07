import React, ***REMOVED*** Component ***REMOVED*** from 'react';
import ***REMOVED*** Bar, Line ***REMOVED*** from 'react-chartjs-2';
import ***REMOVED*** Dropdown, DropdownMenu, DropdownItem, Progress ***REMOVED*** from 'reactstrap';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

// Card Chart 1
const cardChartData1 = ***REMOVED***
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    ***REMOVED***
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40]
    ***REMOVED***
  ],
***REMOVED***;

const cardChartOpts1 = ***REMOVED***
  maintainAspectRatio: false,
  legend: ***REMOVED***
    display: false
  ***REMOVED***,
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
        min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
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
  ***REMOVED***
***REMOVED***

// Card Chart 2
const cardChartData2 = ***REMOVED***
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    ***REMOVED***
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11]
    ***REMOVED***
  ],
***REMOVED***;

const cardChartOpts2 = ***REMOVED***
  maintainAspectRatio: false,
  legend: ***REMOVED***
    display: false
  ***REMOVED***,
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
        min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
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
  ***REMOVED***
***REMOVED***

// Card Chart 3
const cardChartData3 = ***REMOVED***
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    ***REMOVED***
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40]
    ***REMOVED***
  ],
***REMOVED***;

const cardChartOpts3 = ***REMOVED***
  maintainAspectRatio: false,
  legend: ***REMOVED***
    display: false
  ***REMOVED***,
  scales: ***REMOVED***
    xAxes: [***REMOVED***
      display: false
    ***REMOVED***],
    yAxes: [***REMOVED***
      display: false
    ***REMOVED***],
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
  ***REMOVED***
***REMOVED***

// Card Chart 4
const cardChartData4 = ***REMOVED***
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    ***REMOVED***
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
    ***REMOVED***
  ],
***REMOVED***;

const cardChartOpts4 = ***REMOVED***
  maintainAspectRatio: false,
  legend: ***REMOVED***
    display: false
  ***REMOVED***,
  scales: ***REMOVED***
    xAxes: [***REMOVED***
      display: false,
      barPercentage: 0.6,
    ***REMOVED***],
    yAxes: [***REMOVED***
      display: false,
    ***REMOVED***]
  ***REMOVED***
***REMOVED***

// Main Chart

// convert Hex to RGBA
function convertHex(hex,opacity) ***REMOVED***
  hex = hex.replace('#','');
  var r = parseInt(hex.substring(0,2), 16);
  var g = parseInt(hex.substring(2,4), 16);
  var b = parseInt(hex.substring(4,6), 16);

  var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
***REMOVED***

//Random Numbers
function random(min,max) ***REMOVED***
  return Math.floor(Math.random()*(max-min+1)+min);
***REMOVED***

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) ***REMOVED***
  data1.push(random(50,200));
  data2.push(random(80,100));
  data3.push(65);
***REMOVED***

const mainChart = ***REMOVED***
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    ***REMOVED***
      label: 'My First dataset',
      backgroundColor: convertHex(brandInfo,10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    ***REMOVED***,
    ***REMOVED***
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2
    ***REMOVED***,
    ***REMOVED***
      label: 'My Third dataset',
      backgroundColor: 'transparent',
      borderColor: brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5],
      data: data3
    ***REMOVED***
  ]
***REMOVED***

const mainChartOpts = ***REMOVED***
  maintainAspectRatio: false,
  legend: ***REMOVED***
    display: false
  ***REMOVED***,
  scales: ***REMOVED***
    xAxes: [***REMOVED***
      gridLines: ***REMOVED***
        drawOnChartArea: false,
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
    point: ***REMOVED***
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    ***REMOVED***
  ***REMOVED***
***REMOVED***

class Dashboard extends Component ***REMOVED***

  constructor(props) ***REMOVED***
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = ***REMOVED***
      dropdownOpen: false
    ***REMOVED***;
  ***REMOVED***

  toggle() ***REMOVED***
    this.setState(***REMOVED***
      dropdownOpen: !this.state.dropdownOpen
    ***REMOVED***);
  ***REMOVED***

  render() ***REMOVED***
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-sm-6 col-lg-3">
            <div className="card card-inverse card-primary">
              <div className="card-block pb-0">
                <div className="btn-group float-right">
                  <Dropdown isOpen=***REMOVED***this.state.card1***REMOVED*** toggle=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card1: !this.state.card1 ***REMOVED***); ***REMOVED******REMOVED***>
                    <button onClick=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card1: !this.state.card1 ***REMOVED***); ***REMOVED******REMOVED*** className="btn btn-transparent active dropdown-toggle p-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded=***REMOVED***this.state.card1***REMOVED***>
                      <i className="icon-settings"></i>
                    </button>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </div>
              <div className="chart-wrapper px-3">
                <Line data=***REMOVED***cardChartData1***REMOVED*** options=***REMOVED***cardChartOpts1***REMOVED*** height=***REMOVED***70***REMOVED***/>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-inverse card-info">
              <div className="card-block pb-0">
                <div className="btn-group float-right">
                  <Dropdown isOpen=***REMOVED***this.state.card2***REMOVED*** toggle=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card2: !this.state.card2 ***REMOVED***); ***REMOVED******REMOVED***>
                    <button onClick=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card2: !this.state.card2 ***REMOVED***); ***REMOVED******REMOVED*** className="btn btn-transparent active dropdown-toggle p-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded=***REMOVED***this.state.card2***REMOVED***>
                      <i className="icon-settings"></i>
                    </button>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </div>
              <div className="chart-wrapper px-3">
                <Line data=***REMOVED***cardChartData2***REMOVED*** options=***REMOVED***cardChartOpts2***REMOVED*** height=***REMOVED***70***REMOVED***/>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-inverse card-warning">
              <div className="card-block pb-0">
                <div className="btn-group float-right">
                  <Dropdown isOpen=***REMOVED***this.state.card3***REMOVED*** toggle=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card3: !this.state.card3 ***REMOVED***); ***REMOVED******REMOVED***>
                    <button onClick=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card3: !this.state.card3 ***REMOVED***); ***REMOVED******REMOVED*** className="btn btn-transparent active dropdown-toggle p-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded=***REMOVED***this.state.card3***REMOVED***>
                      <i className="icon-settings"></i>
                    </button>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </div>
              <div className="chart-wrapper">
                <Line data=***REMOVED***cardChartData3***REMOVED*** options=***REMOVED***cardChartOpts3***REMOVED*** height=***REMOVED***70***REMOVED***/>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-inverse card-danger">
              <div className="card-block pb-0">
                <div className="btn-group float-right">
                  <Dropdown isOpen=***REMOVED***this.state.card4***REMOVED*** toggle=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card4: !this.state.card4 ***REMOVED***); ***REMOVED******REMOVED***>
                    <button onClick=***REMOVED***() => ***REMOVED*** this.setState(***REMOVED*** card4: !this.state.card4 ***REMOVED***); ***REMOVED******REMOVED*** className="btn btn-transparent active dropdown-toggle p-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded=***REMOVED***this.state.card4***REMOVED***>
                      <i className="icon-settings"></i>
                    </button>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </div>
              <div className="chart-wrapper px-3">
                <Bar data=***REMOVED***cardChartData4***REMOVED*** options=***REMOVED***cardChartOpts4***REMOVED*** height=***REMOVED***70***REMOVED***/>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-block">
            <div className="row">
              <div className="col-sm-5">
                <h4 className="card-title mb-0">Traffic</h4>
                <div className="small text-muted">November 2015</div>
              </div>
              <div className="col-sm-7 hidden-sm-down">
                <button type="button" className="btn btn-primary float-right"><i className="icon-cloud-download"></i></button>
                <div className="btn-toolbar float-right" role="toolbar" aria-label="Toolbar with button groups">
                  <div className="btn-group mr-3" data-toggle="buttons" aria-label="First group">
                    <label className="btn btn-outline-secondary">
                      <input type="radio" name="options" id="option1"/> Day
                    </label>
                    <label className="btn btn-outline-secondary active">
                      <input type="radio" name="options" id="option2" defaultChecked/> Month
                    </label>
                    <label className="btn btn-outline-secondary">
                      <input type="radio" name="options" id="option3"/> Year
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="chart-wrapper" style=***REMOVED******REMOVED***height: 300 + 'px', marginTop: 40 + 'px'***REMOVED******REMOVED***>
              <Line data=***REMOVED***mainChart***REMOVED*** options=***REMOVED***mainChartOpts***REMOVED*** height=***REMOVED***300***REMOVED***/>
            </div>
          </div>
          <div className="card-footer">
            <ul>
              <li>
                <div className="text-muted">Visits</div>
                <strong>29.703 Users (40%)</strong>
                <Progress className="progress-xs mt-2" color="success" value="40" />
              </li>
              <li className="hidden-sm-down">
                <div className="text-muted">Unique</div>
                <strong>24.093 Users (20%)</strong>
                <Progress className="progress-xs mt-2" color="info" value="20" />
              </li>
              <li>
                <div className="text-muted">Pageviews</div>
                <strong>78.706 Views (60%)</strong>
                <Progress className="progress-xs mt-2" color="warning" value="60" />
              </li>
              <li className="hidden-sm-down">
                <div className="text-muted">New Users</div>
                <strong>22.123 Users (80%)</strong>
                <Progress className="progress-xs mt-2" color="danger" value="80" />
              </li>
              <li className="hidden-sm-down">
                <div className="text-muted">Bounce Rate</div>
                <strong>40.15%</strong>
                <Progress className="progress-xs mt-2" color="primary" value="40" />
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 col-lg-3">
            <div className="social-box facebook">
              <i className="fa fa-facebook"></i>
              <div className="chart-wrapper">
                <canvas id="social-box-chart-1" height="90"></canvas>
              </div>
              <ul>
                <li>
                  <strong>89k</strong>
                  <span>friends</span>
                </li>
                <li>
                  <strong>459</strong>
                  <span>feeds</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="social-box twitter">
              <i className="fa fa-twitter"></i>
              <div className="chart-wrapper">
                <canvas id="social-box-chart-2" height="90"></canvas>
              </div>
              <ul>
                <li>
                  <strong>973k</strong>
                  <span>followers</span>
                </li>
                <li>
                  <strong>1.792</strong>
                  <span>tweets</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">

            <div className="social-box linkedin">
              <i className="fa fa-linkedin"></i>
              <div className="chart-wrapper">
                <canvas id="social-box-chart-3" height="90"></canvas>
              </div>
              <ul>
                <li>
                  <strong>500+</strong>
                  <span>contacts</span>
                </li>
                <li>
                  <strong>292</strong>
                  <span>feeds</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="social-box google-plus">
              <i className="fa fa-google-plus"></i>
              <div className="chart-wrapper">
                <canvas id="social-box-chart-4" height="90"></canvas>
              </div>
              <ul>
                <li>
                  <strong>894</strong>
                  <span>followers</span>
                </li>
                <li>
                  <strong>92</strong>
                  <span>circles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                Traffic &amp; Sales
              </div>
              <div className="card-block">
                <div className="row">
                  <div className="col-sm-12 col-lg-4">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="callout callout-info">
                          <small className="text-muted">New Clients</small><br/>
                          <strong className="h4">9,123</strong>
                          <div className="chart-wrapper">
                            <canvas id="sparkline-chart-1" width="100" height="30"></canvas>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="callout callout-danger">
                          <small className="text-muted">Recuring Clients</small><br/>
                          <strong className="h4">22,643</strong>
                          <div className="chart-wrapper">
                            <canvas id="sparkline-chart-2" width="100" height="30"></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="mt-0"/>
                    <ul className="horizontal-bars">
                      <li>
                        <div className="title">
                          Monday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="34" />
                          <Progress className="progress-xs" color="danger" value="78" />
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Tuesday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="56" />
                          <Progress className="progress-xs" color="danger" value="94" />
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Wednesday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="12" />
                          <Progress className="progress-xs" color="danger" value="67" />
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Thursday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="43" />
                          <Progress className="progress-xs" color="danger" value="91" />
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Friday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="22" />
                          <Progress className="progress-xs" color="danger" value="73" />
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Saturday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="53" />
                          <Progress className="progress-xs" color="danger" value="82" />
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Sunday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="9" />
                          <Progress className="progress-xs" color="danger" value="69" />
                        </div>
                      </li>
                      <li className="legend">
                        <span className="badge badge-pill badge-info"></span> <small>New clients</small> &nbsp; <span className="badge badge-pill badge-danger"></span> <small>Recurring clients</small>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-lg-4">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="callout callout-warning">
                          <small className="text-muted">Pageviews</small><br/>
                          <strong className="h4">78,623</strong>
                          <div className="chart-wrapper">
                            <canvas id="sparkline-chart-3" width="100" height="30"></canvas>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="callout callout-success">
                          <small className="text-muted">Organic</small><br/>
                          <strong className="h4">49,123</strong>
                          <div className="chart-wrapper">
                            <canvas id="sparkline-chart-4" width="100" height="30"></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="mt-0"/>
                    <ul className="horizontal-bars type-2">
                      <li>
                        <i className="icon-user"></i>
                        <span className="title">Male</span>
                        <span className="value">43%</span>
                        <div className="bars">
                          <Progress className="progress-xs" color="warning" value="43" />
                        </div>
                      </li>
                      <li>
                        <i className="icon-user-female"></i>
                        <span className="title">Female</span>
                        <span className="value">37%</span>
                        <div className="bars">
                          <Progress className="progress-xs" color="warning" value="37" />
                        </div>
                      </li>
                      <li className="divider"></li>
                      <li>
                        <i className="icon-globe"></i>
                        <span className="title">Organic Search</span>
                        <span className="value">191,235 <span className="text-muted small">(56%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="56" />
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-facebook"></i>
                        <span className="title">Facebook</span>
                        <span className="value">51,223 <span className="text-muted small">(15%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="15" />
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-twitter"></i>
                        <span className="title">Twitter</span>
                        <span className="value">37,564 <span className="text-muted small">(11%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="11" />
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-linkedin"></i>
                        <span className="title">LinkedIn</span>
                        <span className="value">27,319 <span className="text-muted small">(8%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="8" />
                        </div>
                      </li>
                      <li className="divider text-center">
                        <button type="button" className="btn btn-sm btn-link text-muted" data-toggle="tooltip" data-placement="top" title="" data-original-title="show more"><i className="icon-options"></i></button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-lg-4">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="callout">
                          <small className="text-muted">CTR</small><br/>
                          <strong className="h4">23%</strong>
                          <div className="chart-wrapper">
                            <canvas id="sparkline-chart-5" width="100" height="30"></canvas>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="callout callout-primary">
                          <small className="text-muted">Bounce Rate</small><br/>
                          <strong className="h4">5%</strong>
                          <div className="chart-wrapper">
                            <canvas id="sparkline-chart-6" width="100" height="30"></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="mt-0"/>
                    <ul className="icons-list">
                      <li>
                        <i className="icon-screen-desktop bg-primary"></i>
                        <div className="desc">
                          <div className="title">iMac 4k</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>1.924</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-screen-smartphone bg-info"></i>
                        <div className="desc">
                          <div className="title">Samsung Galaxy Edge</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>1.224</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-screen-smartphone bg-warning"></i>
                        <div className="desc">
                          <div className="title">iPhone 6S</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>1.163</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-user bg-danger"></i>
                        <div className="desc">
                          <div className="title">Premium accounts</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>928</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-spotify bg-success"></i>
                        <div className="desc">
                          <div className="title">Spotify Subscriptions</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>893</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-cloud-download bg-danger"></i>
                        <div className="desc">
                          <div className="title">Ebook</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Downloads</div>
                          <strong>121.924</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-camera bg-warning"></i>
                        <div className="desc">
                          <div className="title">Photos</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Uploaded</div>
                          <strong>12.125</strong>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn btn-link text-muted"><i className="icon-settings"></i></button>
                        </div>
                      </li>
                      <li className="divider text-center">
                        <button type="button" className="btn btn-sm btn-link text-muted" data-toggle="tooltip" data-placement="top" title="show more"><i className="icon-options"></i></button>
                      </li>
                    </ul>
                  </div>
                </div>
                <br/>
                <table className="table table-hover table-outline mb-0 hidden-sm-down">
                  <thead className="thead-default">
                    <tr>
                      <th className="text-center"><i className="icon-people"></i></th>
                      <th>User</th>
                      <th className="text-center">Country</th>
                      <th>Usage</th>
                      <th className="text-center">Payment Method</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img src=***REMOVED***'img/avatars/1.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                          <span className="avatar-status badge-success"></span>
                        </div>
                      </td>
                      <td>
                        <div>Yiorgos Avraamu</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <img src=***REMOVED***'img/flags/USA.png'***REMOVED*** alt="USA" style=***REMOVED******REMOVED***height: 24 + 'px'***REMOVED******REMOVED***/>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>50%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                          </div>
                        </div>
                        <Progress className="progress-xs" color="success" value="50" />
                      </td>
                      <td className="text-center">
                        <i className="fa fa-cc-mastercard" style=***REMOVED******REMOVED***fontSize: 24 + 'px'***REMOVED******REMOVED***></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>10 sec ago</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img src=***REMOVED***'img/avatars/2.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                          <span className="avatar-status badge-danger"></span>
                        </div>
                      </td>
                      <td>
                        <div>Avram Tarasios</div>
                        <div className="small text-muted">

                          <span>Recurring</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <img src=***REMOVED***'img/flags/Brazil.png'***REMOVED*** alt="Brazil" style=***REMOVED******REMOVED***height: 24 + 'px'***REMOVED******REMOVED***/>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>10%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                          </div>
                        </div>
                        <Progress className="progress-xs" color="info" value="10" />
                      </td>
                      <td className="text-center">
                        <i className="fa fa-cc-visa" style=***REMOVED******REMOVED***fontSize: 24 + 'px'***REMOVED******REMOVED***></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>5 minutes ago</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img src=***REMOVED***'img/avatars/3.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                          <span className="avatar-status badge-warning"></span>
                        </div>
                      </td>
                      <td>
                        <div>Quintin Ed</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <img src=***REMOVED***'img/flags/India.png'***REMOVED*** alt="India" style=***REMOVED******REMOVED***height: 24 + 'px'***REMOVED******REMOVED***/>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>74%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                          </div>
                        </div>
                        <Progress className="progress-xs" color="warning" value="74" />
                      </td>
                      <td className="text-center">
                        <i className="fa fa-cc-stripe" style=***REMOVED******REMOVED***fontSize: 24 + 'px'***REMOVED******REMOVED***></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>1 hour ago</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img src=***REMOVED***'img/avatars/4.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                          <span className="avatar-status badge-default"></span>
                        </div>
                      </td>
                      <td>
                        <div>Enéas Kwadwo</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <img src=***REMOVED***'img/flags/France.png'***REMOVED*** alt="France" style=***REMOVED******REMOVED***height: 24 + 'px'***REMOVED******REMOVED***/>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>98%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                          </div>
                        </div>
                        <Progress className="progress-xs" color="danger" value="98" />
                      </td>
                      <td className="text-center">
                        <i className="fa fa-paypal" style=***REMOVED******REMOVED***fontSize: 24 + 'px'***REMOVED******REMOVED***></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>Last month</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img src=***REMOVED***'img/avatars/5.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                          <span className="avatar-status badge-success"></span>
                        </div>
                      </td>
                      <td>
                        <div>Agapetus Tadeáš</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <img src=***REMOVED***'img/flags/Spain.png'***REMOVED*** alt="Spain" style=***REMOVED******REMOVED***height: 24 + 'px'***REMOVED******REMOVED***/>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>22%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                          </div>
                        </div>
                        <Progress className="progress-xs" color="info" value="22" />
                      </td>
                      <td className="text-center">
                        <i className="fa fa-google-wallet" style=***REMOVED******REMOVED***fontSize: 24 + 'px'***REMOVED******REMOVED***></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>Last week</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img src=***REMOVED***'img/avatars/6.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                          <span className="avatar-status badge-danger"></span>
                        </div>
                      </td>
                      <td>
                        <div>Friderik Dávid</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <img src=***REMOVED***'img/flags/Poland.png'***REMOVED*** alt="Poland" style=***REMOVED******REMOVED***height: 24 + 'px'***REMOVED******REMOVED***/>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>43%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                          </div>
                        </div>
                        <Progress className="progress-xs" color="success" value="43" />
                      </td>
                      <td className="text-center">
                        <i className="fa fa-cc-amex" style=***REMOVED******REMOVED***fontSize: 24 + 'px'***REMOVED******REMOVED***></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>Yesterday</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ***REMOVED***
***REMOVED***

export default Dashboard;
