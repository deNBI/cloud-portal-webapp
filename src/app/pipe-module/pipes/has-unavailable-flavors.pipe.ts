import { Pipe, PipeTransform } from '@angular/core';
import { Flavor } from '../../virtualmachines/virtualmachinemodels/flavor';

/**
 * Pipe which checks if any of the flavors in a given list are unavailable.
 */
@Pipe({
	name: 'hasUnavailableFlavors',
	pure: false,
})
export class HasUnavailableFlavorsPipe implements PipeTransform {
	transform(flavors: Flavor[]): boolean {
		if (flavors === undefined || flavors.length === 0) {
			return false;
		} else {
			for (const flavor of flavors) {
				if (!flavor.available) {
					return true;
				}
			}

			return false;
		}
	}
}
