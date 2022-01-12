import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generic Pipe to check if element is in list.
 */
@Pipe({
	name: 'inAllowed',
})
export class InAllowedPipe implements PipeTransform {

	transform(list: [string, number][], value: [string, number]): boolean {
		if (value) {
			const index: number = list.map(elem => elem[1]).indexOf(value[1]);

			return index !== -1;
		} else {
			return false;
		}
	}

}
