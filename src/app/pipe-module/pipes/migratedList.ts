import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe which returns counter of flavors.
 */
@Pipe({
	name: 'isMigratedProjectId',
})
export class IsMigratedProjectIdPipe implements PipeTransform {
	transform(pid: string | number, list: string[]) {
		return list.includes(pid.toString());
	}
}
