import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generic Pipe to check if element is in list.
 */
@Pipe({
	name: 'inList',
})
export class InListPipe implements PipeTransform {

	transform(list: any[], value: any): boolean {
		return list.indexOf(value) !== -1;
	}

}
