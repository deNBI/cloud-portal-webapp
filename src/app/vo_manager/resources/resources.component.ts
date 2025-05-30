import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { CsvOutput, download, generateCsv, mkConfig } from 'export-to-csv'

import { VoService } from '../../api-connector/vo.service'
import { Resources } from './resources'
import { NgIf, NgFor, DatePipe } from '@angular/common'

/**
 * Resource component.
 */
@Component({
	selector: 'app-resources',
	templateUrl: './resources.component.html',
	styleUrls: ['./resources.component.scss'],
	providers: [VoService],
	imports: [NgIf, NgFor, DatePipe]
})
export class ResourcesComponent implements OnInit {
	title: string = 'VO Overview: Resources'
	@ViewChild('resourcesTable') pdfTable: ElementRef

	isLoaded: boolean = false
	voResources: Resources[] = []
	fileName: string = 'VoResources'
	tableId: string = 'resourcesTable'
	today: number = Date.now()

	constructor(private voservice: VoService) {
		this.getVoProjectResources()
	}

	public getVoProjectResources(): void {
		this.voservice.getVoProjectResources().subscribe((res: Resources[]): void => {
			this.voResources = res
			this.isLoaded = true
		})
	}

	public tableToCSV(): void {
		const csvConfig = mkConfig({
			fieldSeparator: ',',
			quoteStrings: true,
			decimalSeparator: '.',
			showTitle: false,
			// title: `${this.selectedFacility['Facility']} Resources`,
			filename: 'vo_resources.csv',
			useTextFile: false,
			useBom: true,
			useKeysAsHeaders: true
			// headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
		})

		const converted: any[] = this.voResources.map((res: Resources) => Object.assign(res))
		const csv: CsvOutput = generateCsv(csvConfig)(converted)

		download(csvConfig)(csv)
	}

	ngOnInit(): void {}
}
