import ***REMOVED***Component, ElementRef, EventEmitter, OnInit, Output, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***BiocondaService***REMOVED*** from '../../api-connector/bioconda.service';
import ***REMOVED***Subject***REMOVED*** from 'rxjs';
import ***REMOVED***debounceTime, distinctUntilChanged***REMOVED*** from 'rxjs/operators';
import ***REMOVED***PaginationComponent***REMOVED*** from 'ngx-bootstrap';

export interface IBiocondaTool ***REMOVED***
  name: string,
  version: string,
  build: string
***REMOVED***

@Component(***REMOVED***
             selector: 'app-bioconda',
             templateUrl: 'bioconda.component.html',
             providers: [BiocondaService]
           ***REMOVED***)
export class BiocondaComponent implements OnInit ***REMOVED***
  FIRST_PAGE: number = 1;
  DEBOUNCE_TIME: number = 300;

  all_tools: IBiocondaTool[] = [];

  chosen_tools: IBiocondaTool[] = [];

  toolsPerPage: number = 10;

  currentPage: number = this.FIRST_PAGE;

  toolsStart: number = 0;

  toolsEnd: number = this.toolsPerPage;

  filterToolName: string = '';

  filterToolVersion: string = '';

  filterToolBuild: string = '';
  isSearching: boolean;

  max_pages: number = 15;
  total_pages: number;

  filternameChanged: Subject<string> = new Subject<string>();
  filterVersionChanged: Subject<string> = new Subject<string>();
  filterBuildChanged: Subject<string> = new Subject<string>();

  @Output() readonly hasTools: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('pagination') pagination: PaginationComponent;
  @ViewChild('chosenTable') chosenTable: ElementRef;

  constructor(private condaService: BiocondaService) ***REMOVED***
  ***REMOVED***

  pageChanged(event): void ***REMOVED***
    this.getAllTools(event.page);
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getAllTools(this.FIRST_PAGE);

    this.filternameChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((filterName: string) => ***REMOVED***
        this.filterToolName = filterName;
        this.getAllTools(this.FIRST_PAGE)

      ***REMOVED***);

    this.filterVersionChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((filterVersion: string) => ***REMOVED***
        this.filterToolVersion = filterVersion;
        this.getAllTools(this.FIRST_PAGE)

      ***REMOVED***);

    this.filterBuildChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((filterBuild: string) => ***REMOVED***
        this.filterToolBuild = filterBuild;
        this.getAllTools(this.FIRST_PAGE)

      ***REMOVED***);

  ***REMOVED***

  getAllTools(page: number): void ***REMOVED***
    this.isSearching = true;
    this.condaService.getAllTools(page, this.filterToolName, this.filterToolVersion, this.filterToolBuild).subscribe(
      res => ***REMOVED***
        this.all_tools = [];

        for (const line of res['packages']) ***REMOVED***
          this.all_tools.push(***REMOVED***
                                name: line['name'],
                                version: line['version'],
                                build: line['build']
                              ***REMOVED***)
        ***REMOVED***
        this.toolsPerPage = res['items_per_page'];
        this.total_pages = res['total_items'];
        this.toolsStart = 0;
        this.toolsEnd = this.toolsPerPage;

        this.currentPage = page;
        this.pagination.selectPage(this.currentPage);
        this.isSearching = false;
      ***REMOVED***);
  ***REMOVED***

  changedNameFilter(text: string): void ***REMOVED***
    this.filternameChanged.next(text);

  ***REMOVED***

  changedVersionFilter(text: string): void ***REMOVED***
    this.filterVersionChanged.next(text);

  ***REMOVED***

  changedBuildFilter(text: string): void ***REMOVED***
    this.filterBuildChanged.next(text);

  ***REMOVED***

  add_or_remove(tool: IBiocondaTool): void ***REMOVED***
    let deleted: boolean = false;
    this.chosen_tools.forEach((item: IBiocondaTool, index: number) => ***REMOVED***
      if (tool.name === item.name && tool.version === item.version && tool.build === item.build) ***REMOVED***
        this.chosen_tools.splice(index, 1);
        deleted = true;
      ***REMOVED*** else if (tool.name === item.name && (tool.version !== item.version || tool.build !== item.build)) ***REMOVED***
        this.chosen_tools.splice(index, 1);
        deleted = true;
        this.chosen_tools.push(tool);
      ***REMOVED***
    ***REMOVED***);
    if (!deleted) ***REMOVED***
      this.chosen_tools.push(tool);
    ***REMOVED***
    this.hasTools.emit(this.hasChosenTools());
  ***REMOVED***

  is_added(tool: IBiocondaTool): boolean ***REMOVED***
    let found: boolean = false;
    this.chosen_tools.forEach((item: IBiocondaTool) => ***REMOVED***
      if (tool.name === item.name && tool.version === item.version && tool.build === item.build) ***REMOVED***
        found = true;
      ***REMOVED***
    ***REMOVED***);

    return found;
  ***REMOVED***

  getChosenTools(): string ***REMOVED***
    return JSON.stringify(this.chosen_tools);
  ***REMOVED***

  getTimeout(): number ***REMOVED***
    return ((this.chosen_tools.length) * 300) + 600;
  ***REMOVED***

  hasChosenTools(): boolean ***REMOVED***
    return this.chosen_tools.length > 0;
  ***REMOVED***
***REMOVED***
