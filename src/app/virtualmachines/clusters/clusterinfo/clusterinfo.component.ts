import { Component, Input } from '@angular/core';
import { Clusterinfo } from '../clusterinfo';

/**
 * Clusterinfo component
 */
@Component({
	selector: 'app-clusterinfo',
	templateUrl: './clusterinfo.component.html',
})
export class ClusterinfoComponent {
  @Input() cluster: Clusterinfo;

}
