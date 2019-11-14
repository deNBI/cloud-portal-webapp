import {Component, Input, OnInit} from '@angular/core';

@Component({
             selector: 'app-resource-overview',
             templateUrl: './resource-overview.component.html',
             styleUrls: ['./resource-overview.component.scss']
           })
export class ResourceOverviewComponent implements OnInit {

  /**
   * Selected Project diskspace max.
   */
  @Input() selectedProjectDiskspaceMax: number;

  /**
   * Selected Project diskspace used.
   */
  @Input() selectedProjectDiskspaceUsed: number;

  /**
   * Selected Project volumes max.
   */
  @Input() selectedProjectVolumesMax: number;

  /**
   * Selected Project volumes used.
   */
  @Input() selectedProjectVolumesUsed: number;

  @Input() selectedProjectCoresUsed: number;

  @Input() selectedProjectCoresMax: number;

  @Input() selectedProjectRamMax: number;

  @Input() selectedProjectRamUsed: number;

  /**
   * Selected Project vms max.
   */
  @Input() selectedProjectVmsMax: number;

  /**
   * Selected Project vms used.
   */
  @Input() selectedProjectVmsUsed: number;

  @Input() selectedProjectGPUsUsed: number;
  @Input() selectedProjectGPUsMax: number;

  constructor() {
  }

  ngOnInit(): void {
  }

}
