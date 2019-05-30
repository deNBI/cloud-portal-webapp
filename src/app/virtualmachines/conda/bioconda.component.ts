import {Component, OnInit} from '@angular/core';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';

export interface IBiocondaTool {
  name: string,
  version: string,
  build: string
}

@Component({
  selector: 'app-bioconda',
  templateUrl: 'bioconda.component.html',
  providers: [BiocondaService],
           })
export class BiocondaComponent implements OnInit{

  bioconda_tools: IBiocondaTool[] = [];

  tools_filtered: IBiocondaTool[];

  tools_returned: IBiocondaTool[];

  toolsPerPage: number = 10;

  currentPage: number = 1;

  toolsStart: number = 0;

  toolsEnd: number = this.toolsPerPage;

  filterToolName: string;

  filterToolVersion: string;

  filterToolBuild: string;

  max_pages: number = 15;

  constructor(private condaService: BiocondaService) {}

  ngOnInit(): void {
    this.getBiocondaTools();
  }

  getBiocondaTools(): void {
    this.condaService.getBiocondaTools().subscribe(
      res => {
        for (const line in res['packages']) {
          this.bioconda_tools.push({name: res['packages'][line]['name'],
                                     version: res['packages'][line]['version'],
                                     build: res['packages'][line]['build']})
        }
        this.applyFilter()});
  }

  pageChanged(event): void {

    const startItem: number = (event.page - 1) * event.itemsPerPage;
    const endItem: number = event.page * event.itemsPerPage;
    this.toolsStart = startItem;
    this.toolsEnd = endItem;
    this.tools_returned = this.tools_filtered.slice(startItem, endItem)

  }

  checkFilter(tool: IBiocondaTool): boolean {
    return this.filterName(tool) && this.filterVersion(tool) && this.filterBuild(tool);

  }

  applyFilter(): void {
    this.tools_filtered = this.bioconda_tools.filter(vm => this.checkFilter(vm));

    this.toolsStart = 0;
    this.toolsEnd = this.toolsPerPage;

    this.tools_returned = this.tools_filtered.slice(this.toolsStart, this.toolsEnd);
    this.currentPage = 1

  }

  filterName(tool: IBiocondaTool): boolean {
    if (!this.filterToolName) {
      return true;
    } else if (tool.name.includes(this.filterToolName)) {
      return true;
    } else {
      return false;
    }
  }

  filterVersion(tool: IBiocondaTool): boolean {
    if (!this.filterToolVersion) {
      return true;
    } else if (tool.version.includes(this.filterToolVersion)) {
      return true;
    } else {
      return false;
    }
  }

  filterBuild(tool: IBiocondaTool): boolean {
    if (!this.filterToolBuild) {
      return true;
    } else if (tool.build.includes(this.filterToolBuild)) {
      return true;
    } else {
      return false;
    }
  }
}
