import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { BiocondaService } from '../../api-connector/bioconda.service';
import { CondaPackageMeta } from './conda-package-meta';
import { CondaPackage } from './condaPackage.model';

/**
 * Bioconda component.
 */
@Component({
	selector: 'app-bioconda',
	templateUrl: 'bioconda.component.html',
	providers: [BiocondaService],
})
export class BiocondaComponent implements OnInit {
	FIRST_PAGE: number = 1;
	DEBOUNCE_TIME: number = 700;

	all_tools_meta: CondaPackageMeta[] = [];

	chosen_tools: CondaPackage[] = [];

	toolsPerPage: number = 10;

	currentPage: number = this.FIRST_PAGE;

	toolsStart: number = 0;

	toolsEnd: number = this.toolsPerPage;

	filterToolName: string = '';

	isSearching: boolean;

	max_pages: number = 15;
	total_pages: number;
	window_size: number;
	MAX_WINDOW_SIZE: number = 1200;

	filternameChanged: Subject<string> = new Subject<string>();

	@Output() readonly hasTools: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('pagination', { static: true }) pagination: PaginationComponent;
	@ViewChild('chosenTable', { static: true }) chosenTable: ElementRef;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@HostListener('window:resize', ['$event']) onResize(event: any): void {
		this.window_size = window.innerWidth;
	}

	constructor(private condaService: BiocondaService, private cdr: ChangeDetectorRef) {
		this.condaService = condaService;
		this.cdr = cdr;
	}

	pageChanged(event: any): void {
		this.getAllTools(event.page);
	}

	ngOnInit(): void {
		this.window_size = window.innerWidth;

		this.getAllTools(this.FIRST_PAGE);

		this.filternameChanged
			.pipe(
				debounceTime(this.DEBOUNCE_TIME),
				distinctUntilChanged(),
				switchMap((filterName: string): any => {
					this.isSearching = true;

					this.filterToolName = filterName.trim();

					return this.condaService.getAllTools(1, this.filterToolName);
				}),
			)
			.subscribe((res: any): void => {
				this.setAllTools(res);
			});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onChange(event: any): void {
		this.cdr.detectChanges();
	}

	getAllTools(page: number): void {
		this.isSearching = true;
		this.condaService.getAllTools(page, this.filterToolName).subscribe((metas: any): void => {
			this.all_tools_meta = metas['packages'];

			this.toolsPerPage = metas['items_per_page'];
			this.total_pages = metas['total_items'];
			this.toolsStart = 0;
			this.toolsEnd = this.toolsPerPage;

			this.currentPage = page;
			this.pagination.selectPage(this.currentPage);
			this.cdr.detectChanges();

			this.isSearching = false;
		});
	}

	setAllTools(res: any): void {
		this.isSearching = true;

		this.all_tools_meta = res['packages'];
		this.total_pages = res['total_items'];
		this.toolsStart = 0;
		this.toolsEnd = this.toolsPerPage;

		this.currentPage = 1;
		this.pagination.selectPage(this.currentPage);
		this.cdr.detectChanges();

		this.isSearching = false;
	}

	changedNameFilter(text: string): void {
		this.filternameChanged.next(text);
	}

	addTool(name: string, version: string): void {
		const tool: CondaPackage = new CondaPackage(null, name, version);

		if (!this.is_tool_name_added(tool.name)) {
			this.chosen_tools.push(tool);
		} else {
			this.chosen_tools.forEach((item: CondaPackage, index: number): void => {
				if (tool.name === item.name) {
					this.chosen_tools.splice(index, 1);
				}
			});
			this.chosen_tools.push(tool);
		}
		this.hasTools.emit(this.hasChosenTools());
	}

	removeTool(tool: CondaPackage): void {
		let deleted: boolean = false;

		this.chosen_tools.forEach((item: CondaPackage, index: number): void => {
			if (tool.name === item.name && tool.version === item.version) {
				this.chosen_tools.splice(index, 1);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				deleted = true;
			}
		});

		this.hasTools.emit(this.hasChosenTools());
	}

	is_tool_name_added(name: string): boolean {
		let found: boolean = false;
		this.chosen_tools.forEach((item: CondaPackage): void => {
			if (name === item.name) {
				found = true;
			}
		});

		return found;
	}

	is_added(name: string, version: string): boolean {
		const tool: CondaPackage = new CondaPackage(null, name, version);

		let found: boolean = false;
		this.chosen_tools.forEach((item: CondaPackage): void => {
			if (tool.name === item.name && tool.version === item.version) {
				found = true;
			}
		});

		return found;
	}

	getChosenTools(): string {
		return JSON.stringify(this.chosen_tools);
	}

	getTimeout(): number {
		return this.chosen_tools.length * 300 + 840;
	}

	hasChosenTools(): boolean {
		return this.chosen_tools.length > 0;
	}
}
