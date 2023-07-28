import {
	Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';

import { ExportToCsv } from 'export-to-csv';
import { VoService } from '../../api-connector/vo.service';
import { Resources } from './resources';

/**
 * Resource component.
 */
@Component({
	selector: 'app-resources',
	templateUrl: './resources.component.html',
	styleUrls: ['./resources.component.scss'],
	providers: [VoService],
})
export class ResourcesComponent implements OnInit {
	title: string = 'VO Overview: Resources';
	@ViewChild('resourcesTable') pdfTable: ElementRef;

	isLoaded: boolean = false;
	voResources: Resources[] = [];
	fileName: string = 'VoResources';
	tableId: string = 'resourcesTable';
	today: number = Date.now();

	constructor(private voservice: VoService) {
		this.getVoProjectResources();
	}

	public getVoProjectResources(): void {
		this.voservice.getVoProjectResources().subscribe((res: Resources[]): void => {
			this.voResources = res;
			this.isLoaded = true;
		});
	}

	public tableToCSV(): void {
		const options = {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalSeparator: '.',
			showLabels: true,
			showTitle: false,
			// title: `${this.selectedFacility['Facility']} Resources`,
			filename: 'vo_resources.csv',
			useTextFile: false,
			useBom: true,
			useKeysAsHeaders: true,
			// headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
		};

		const csvExporter = new ExportToCsv(options);

		csvExporter.generateCsv(this.voResources);
	}

	ngOnInit(): void {}
}
