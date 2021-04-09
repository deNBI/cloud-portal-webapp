import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationModification } from '../../applications/application_modification.model';
import { Application } from '../../applications/application.model/application.model';
import { Flavor } from '../../virtualmachines/virtualmachinemodels/flavor';

/**
 * Pipe which returns counter of flavors.
 */
@Pipe({
	name: 'flavorCounter',
})
export class FlavorCounterPipe implements PipeTransform {
	transform(appl: ApplicationModification | Application, flavor: Flavor): number {
		return appl.getFlavorCounter(flavor);
	}
}
