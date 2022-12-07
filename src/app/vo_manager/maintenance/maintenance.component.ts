import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import * as saveSVG from 'save-svg-as-png';
import bb, { areaSpline, bar, Chart } from 'billboard.js';
import { jsPDF } from 'jspdf';
import * as d3 from 'd3';

import { NumbersService } from '../../api-connector/numbers.service';
import 'svg2pdf.js';

/**
 * Component to display graphs which illustrate numbers for VO.
 */
@Component({
	selector: 'app-maintenance',
	templateUrl: './maintenance.component.html',
	styleUrls: ['./maintenance.component.scss'],
	providers: [NumbersService],
})
export class MaintenanceComponent implements OnInit {
	is_vo_admin: boolean = true;
	title: string = 'Maintenance';

	constructor() {

	}


	ngOnInit(): void {

	}


}
