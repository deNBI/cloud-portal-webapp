import { Component, OnInit } from '@angular/core'
import * as saveSVG from 'save-svg-as-png'
import bb, { areaSpline, bar, Chart } from 'billboard.js'
import * as d3 from 'd3'

import { NumbersService } from '../../api-connector/numbers.service'
import 'svg2pdf.js'

/**
 * Component to display graphs which illustrate numbers for VO.
 */
@Component({
	selector: 'app-number-charts',
	templateUrl: './number-charts.component.html',
	styleUrls: ['./number-charts.component.css'],
	providers: [NumbersService],
	imports: []
})
export class NumberChartsComponent implements OnInit {
	is_vo_admin: boolean = true
	title: string = 'Cloud Numbers'

	constructor(private numbersService: NumbersService) {}

	/**
	 * Charts
	 */
	public coresAreaChart: Chart
	public coresBarChart: Chart
	public ramAreaChart: Chart
	public ramBarChart: Chart
	public projectNumbersAreaChart: Chart
	public projectNumbersBarChart: Chart

	showCoresBarChart: boolean = false
	showCoresAreChart: boolean = true
	showRamBarChart: boolean = false
	showRamAreChart: boolean = true
	showProjectNumbersAreaChart: boolean = true
	showProjectNumbersBarChart: boolean = false
	generatingNumbersCharts: boolean = true
	generatingRamsCharts: boolean = true
	generatingCoresCharts: boolean = true

	/**
	 * Lists for numbers of projects per project type and status.
	 */
	private runningOpenstack: any[] = ['OpenStack running']
	private runningSimpleVM: any[] = ['SimpleVM running']
	private terminatedOpenstack: any[] = ['OpenStack terminated']
	private terminatedSimpleVM: any[] = ['SimpleVM terminated']
	private endDatesProjects: any[] = ['x']

	/**
	 * Lists for ram and cores numbers.
	 */

	private simpleVMRam: any[] = ['RAM SimpleVM']
	private simpleVMCores: any[] = ['Cores SimpleVM']
	private openstackRam: any[] = ['RAM OpenStack']
	private openstackCores: any[] = ['Cores Openstack']
	private endDatesResources: any[] = ['x']

	ngOnInit(): void {
		this.getData()
	}

	/**
	 * Gets the Data from the API and separates it into the lists.
	 */
	getData(): void {
		/* tslint:disable */
		this.numbersService.getProjectCounterTimeline().subscribe(
			(result: object[]): void => {
				result.forEach((valuePack: any): void => {
					this.runningOpenstack.push(valuePack['running_openstack'])
					this.runningSimpleVM.push(valuePack['running_simple_vm'])
					this.terminatedOpenstack.push(valuePack['terminated_openstack'])
					this.terminatedSimpleVM.push(valuePack['terminated_simple_vm'])
					this.endDatesProjects.push(valuePack['end_date'])
				})
				this.drawProjectNumbersChart()
			},
			(err: Error) => {
				console.log(err)
			}
		)

		this.numbersService.getRamCoresTimeline().subscribe(
			(result: object[]): void => {
				result.forEach((valuePack: object): void => {
					this.openstackCores.push(valuePack['openstack_cores'])
					this.openstackRam.push(valuePack['openstack_ram'])
					this.simpleVMCores.push(valuePack['simple_vm_cores'])
					this.simpleVMRam.push(valuePack['simple_vm_ram'])
					this.endDatesResources.push(valuePack['end_date'])
				})
				this.drawRamNumbersChart()
				this.drawCoresNumbersChart()
			},
			(err: Error) => {
				console.log(err)
			}
		)
	}

	/**
	 * Downloads the numbers graphic as a png.
	 */
	downloadAsPNG(elementId: string, filename: string): void {
		const svg = d3.select(`#${elementId} svg`)
		svg.attr('id', 'svgToDownload')

		saveSVG.saveSvgAsPng(document.getElementById('svgToDownload'), filename.concat('.png'), {})
		svg.attr('id', null)
	}

	/**
	 * Maybe refactor, so only one function is necessary and independent from chart to draw.
	 * Draws the cores Chart into the template.
	 */
	drawCoresNumbersChart(): void {
		this.generatingCoresCharts = true

		this.coresAreaChart = bb.generate({
			bindto: '#coresAreaChart',
			size: {
				height: 600
			},
			data: {
				x: 'x',
				columns: [this.endDatesResources, this.simpleVMCores, this.openstackCores],
				type: areaSpline(),
				groups: [[this.simpleVMCores[0], this.openstackCores[0]]],
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
			},
			point: {
				show: false
			}
		})

		this.coresBarChart = bb.generate({
			bindto: '#coresBarChart',
			size: {
				height: 600
			},
			data: {
				x: 'x',
				columns: [this.endDatesResources, this.simpleVMCores, this.openstackCores],
				type: bar(),
				groups: [[this.simpleVMCores[0], this.openstackCores[0]]],
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
			},
			point: {
				show: false
			}
		})
		this.generatingCoresCharts = false
	}

	/**
	 * Maybe refactor, so only one function is necessary and independent from chart to draw.
	 * Draws the ram Chart into the template.
	 */
	drawRamNumbersChart(): void {
		this.generatingRamsCharts = true

		this.ramAreaChart = bb.generate({
			bindto: '#ramAreaChart',
			size: {
				height: 600
			},
			data: {
				x: 'x',
				columns: [this.endDatesResources, this.simpleVMRam, this.openstackRam],
				type: areaSpline(),
				groups: [[this.simpleVMRam[0], this.openstackRam[0]]],
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
			},
			point: {
				show: false
			}
		})

		this.ramBarChart = bb.generate({
			bindto: '#ramBarChart',
			size: {
				height: 600
			},
			data: {
				x: 'x',
				columns: [this.endDatesResources, this.simpleVMRam, this.openstackRam],
				type: bar(),
				groups: [[this.simpleVMRam[0], this.openstackRam[0]]],
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
			},
			point: {
				show: false
			}
		})
		this.generatingRamsCharts = false
	}

	/**
	 * Draws the project numbers chart in the template.
	 */
	drawProjectNumbersChart(): void {
		this.generatingNumbersCharts = true
		this.projectNumbersAreaChart = bb.generate({
			bindto: '#projectNumbersAreaChart',
			size: {
				height: 600
			},
			data: {
				x: 'x',
				columns: [
					this.endDatesProjects,
					this.runningSimpleVM,
					this.terminatedSimpleVM,
					this.runningOpenstack,
					this.terminatedOpenstack
				],
				type: areaSpline(),
				groups: [
					[this.runningSimpleVM[0], this.terminatedSimpleVM[0], this.runningOpenstack[0], this.terminatedOpenstack[0]]
				],
				order: null
			},

			color: {
				pattern: ['#00adef', '#004b69', '#ed1944', '#590000']
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
			},
			point: {
				show: false
			}
		})

		this.projectNumbersBarChart = bb.generate({
			bindto: '#projectNumbersBarChart',
			size: {
				height: 600
			},
			data: {
				x: 'x',
				columns: [
					this.endDatesProjects,
					this.runningSimpleVM,
					this.terminatedSimpleVM,
					this.runningOpenstack,
					this.terminatedOpenstack
				],
				type: bar(),
				groups: [
					[this.runningSimpleVM[0], this.terminatedSimpleVM[0], this.runningOpenstack[0], this.terminatedOpenstack[0]]
				],
				order: null
			},

			color: {
				pattern: ['#00adef', '#004b69', '#ed1944', '#590000']
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
			},
			point: {
				show: false
			}
		})
		this.generatingNumbersCharts = false
	}

	toggleGraph(chart: string): void {
		switch (chart) {
			case 'cores': {
				this.showCoresBarChart = !this.showCoresBarChart
				this.showCoresAreChart = !this.showCoresAreChart

				break
			}
			case 'ram': {
				this.showRamAreChart = !this.showRamAreChart
				this.showRamBarChart = !this.showRamBarChart
				break
			}
			case 'projects': {
				this.showProjectNumbersBarChart = !this.showProjectNumbersBarChart
				this.showProjectNumbersAreaChart = !this.showProjectNumbersAreaChart
				break
			}
			default: {
				break
			}
		}
	}
}
