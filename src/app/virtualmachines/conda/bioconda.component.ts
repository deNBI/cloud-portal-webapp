import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {fromEvent, Subject,} from 'rxjs';
import {debounceTime, map, distinctUntilChanged} from 'rxjs/operators';
import {ModalDirective, PaginationComponent} from 'ngx-bootstrap';

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

  @ViewChild('pagination') pagination: PaginationComponent;

  constructor(private condaService: BiocondaService) {
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

  changedNameFilter(text: string): void {
    this.filternameChanged.next(text);

  }

  changedVersionFilter(text: string): void {
    this.filterVersionChanged.next(text);

  }

  changedBuildFilter(text: string): void {
    this.filterBuildChanged.next(text);

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

  pageChanged(event): void {
    this.getBiocondaTools(event.page);

  }

}
