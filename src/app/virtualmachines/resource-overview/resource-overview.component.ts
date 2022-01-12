import {
	Component, Input, OnChanges, OnInit,
} from '@angular/core';
import { ApplicationRessourceUsage } from '../../applications/application-ressource-usage/application-ressource-usage';

/**
 * Resource Overview Component
 */
@Component({
	selector: 'app-resource-overview',
	templateUrl: './resource-overview.component.html',
	styleUrls: ['./resource-overview.component.scss'],
})
export class ResourceOverviewComponent implements OnInit, OnChanges {

	@Input() ressourceUsage: ApplicationRessourceUsage;
	@Input() showAdditionalRes: boolean = false;

	@Input() newDiskspace: number = 0;
	newVolumes: number = 0;
	@Input() newCores: number = 0;
	@Input() newRam: number = 0;
	@Input() newVms: number = 0;
	@Input() newGpus: number = 0;

	info_background: string = '#17a2b8';

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
