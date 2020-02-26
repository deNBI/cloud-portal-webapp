import {Component, Input} from '@angular/core';
import {Clusterinfo} from '../clusterinfo';

@Component({
             selector: 'app-clusterinfo',
             templateUrl: './clusterinfo.component.html'
           })
export class ClusterinfoComponent {
  @Input() cluster: Clusterinfo;

  constructor() {
  }

}
