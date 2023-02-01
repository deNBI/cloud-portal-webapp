import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to check if the date picked is in the future.
 */
@Pipe({
	name: 'isFutureTime',
	pure: false,
})
export class IsFutureTimePipe implements PipeTransform {
	transform(date: Date): boolean {
		if (date === null) {
			return false;
		}

		return new Date().getTime() <= date.getTime();
	}
}
