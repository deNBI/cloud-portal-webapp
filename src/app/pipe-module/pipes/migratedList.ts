import { Pipe, PipeTransform } from '@angular/core'

/**
 * Pipe which returns whether a project id belongs to a migrated project or not.
 */
@Pipe({
	name: 'isMigratedProjectId'
})
export class IsMigratedProjectIdPipe implements PipeTransform {
	transform(pid: string | number, list: string[]) {
		return list.includes(pid.toString())
	}
}
