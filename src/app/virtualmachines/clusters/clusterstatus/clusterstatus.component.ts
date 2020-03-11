import {Component, Input} from '@angular/core';
import {Clusterinfo} from '../clusterinfo';

/**
 * Clusterstatus component.
 */
@Component({
             selector: 'app-clusterstatus',
             templateUrl: './clusterstatus.component.html'
           })
export class ClusterstatusComponent {
  @Input() cluster: Clusterinfo;

  constructor() {
  }

}
