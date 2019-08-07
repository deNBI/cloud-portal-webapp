import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {PaginationComponent} from 'ngx-bootstrap';

export interface IBiocondaTool {
  name: string,
  version: string,
  build: string
}

@Component({
             selector: 'app-bioconda',
             templateUrl: 'bioconda.component.html',
             providers: [BiocondaService]
           })
export class BiocondaComponent implements OnInit {
  FIRST_PAGE: number = 1;
  DEBOUNCE_TIME: number = 300;

  bioconda_tools: IBiocondaTool[] = [];

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

  constructor(private condaService: BiocondaService) {
  }

  pageChanged(event): void {
    this.getBiocondaTools(event.page);
  }

  ngOnInit(): void {
    this.getBiocondaTools(this.FIRST_PAGE);

    this.filternameChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((filterName: string) => {
        this.filterToolName = filterName;
        this.getBiocondaTools(this.FIRST_PAGE)

      });

    this.filterVersionChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((filterVersion: string) => {
        this.filterToolVersion = filterVersion;
        this.getBiocondaTools(this.FIRST_PAGE)

      });

    this.filterBuildChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((filterBuild: string) => {
        this.filterToolBuild = filterBuild;
        this.getBiocondaTools(this.FIRST_PAGE)

      });

  }

  getBiocondaTools(page: number): void {
    this.condaService.getBiocondaTools(page, this.filterToolName, this.filterToolVersion, this.filterToolBuild).subscribe(
      res => {
        this.bioconda_tools = [];

        for (const line of res['packages']) {
          this.bioconda_tools.push({
                                     name: line['name'],
                                     version: line['version'],
                                     build: line['build']
                                   })
        }

        this.total_pages = res['num_pages'];
        this.toolsStart = 0;
        this.toolsEnd = this.toolsPerPage;

        this.currentPage = page;
        this.pagination.selectPage(this.currentPage);
      });
  }

  changedNameFilter(text: string): void {
    this.filternameChanged.next(text);

  }

  changedVersionFilter(text: string): void {
    this.filterVersionChanged.next(text);

  }

  changedBuildFilter(text: string): void {
    this.filterBuildChanged.next(text);

  }

  add_or_remove(tool: IBiocondaTool): void {
    let deleted: boolean = false;
    this.chosen_tools.forEach((item: IBiocondaTool, index: number) => {
      if (tool.name === item.name && tool.version === item.version && tool.build === item.build) {
        this.chosen_tools.splice(index, 1);
        deleted = true;
      } else if (tool.name === item.name && (tool.version !== item.version || tool.build !== item.build)) {
        this.chosen_tools.splice(index, 1);
        deleted = true;
        this.chosen_tools.push(tool);
      }
    });
    if (!deleted) {
      this.chosen_tools.push(tool);
    }
    this.hasTools.emit(this.hasChosenTools());
  }

  is_added(tool: IBiocondaTool): boolean {
    let found: boolean = false;
    this.chosen_tools.forEach((item: IBiocondaTool) => {
      if (tool.name === item.name && tool.version === item.version && tool.build === item.build) {
        found = true;
      }
    });

    return found;
  }

  getChosenTools(): string {
    return JSON.stringify(this.chosen_tools);
  }

  getTimeout(): number {
    return ((this.chosen_tools.length) * 300) + 840;
  }

  hasChosenTools(): boolean {
    return this.chosen_tools.length > 0;
  }
}
