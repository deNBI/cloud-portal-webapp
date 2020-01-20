import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
             selector: 'app-resource-overview',
             templateUrl: './resource-overview.component.html',
             styleUrls: ['./resource-overview.component.scss']
           })
export class ResourceOverviewComponent implements OnInit, OnChanges {

  @Input() selectedProjectDiskspaceMax: number;
  @Input() selectedProjectDiskspaceUsed: number;
  @Input() selectedProjectVolumesMax: number;
  @Input() selectedProjectVolumesUsed: number;
  @Input() selectedProjectCoresUsed: number;
  @Input() selectedProjectCoresMax: number;
  @Input() selectedProjectRamMax: number;
  @Input() selectedProjectRamUsed: number;
  @Input() selectedProjectVmsMax: number;
  @Input() selectedProjectVmsUsed: number;
  @Input() selectedProjectGPUsUsed: number;
  @Input() selectedProjectGPUsMax: number;
  @Input() showAdditionalRes: boolean = false;

  @Input() newDiskspace: number = 0;
  newVolumes: number = 0;
  @Input() newCores: number = 0;
  @Input() newRam: number = 0;
  @Input() newVms: number = 0;
  @Input() newGpus: number = 0;

  info_background: string = '#17a2b8';

  constructor() {
  }

  ngOnChanges(): void {
    if (this.newDiskspace > 0) {
      this.newVolumes = 1;
    } else {
      this.newVolumes = 0;
    }
  }

  ngOnInit(): void {

  }
}
