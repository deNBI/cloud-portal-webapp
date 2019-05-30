import {Component, OnInit} from '@angular/core';
import {BiocondaService} from '../../api-connector/bioconda.service';

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

  constructor(private condaService: BiocondaService) {}

  ngOnInit(): void {
    this.condaService.getBiocondaTools().subscribe(
      res => {
        for (const line in res['packages']) {
          this.bioconda_tools.push({name: res['packages'][line]['name'],
                                     version: res['packages'][line]['version'],
                                     build: res['packages'][line]['build']})
          }});
  }
}
