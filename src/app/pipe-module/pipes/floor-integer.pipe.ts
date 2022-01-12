import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe which checks if status is in list.
 */
@Pipe({
	name: 'floorInteger',
})
export class FloorIntegerPipe implements PipeTransform {

	transform(integer: number): number {
		return Math.floor(integer);
	}
}
