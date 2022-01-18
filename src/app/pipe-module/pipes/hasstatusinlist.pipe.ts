import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../../applications/application.model/application.model';
import { ProjectEnumeration } from '../../projectmanagement/project-enumeration';

/**
 * Pipe which checks if status is in list.
 */
@Pipe({
	name: 'hasstatusinlist',
	pure: false,
})
export class HasstatusinlistPipe implements PipeTransform {

	transform(appl: Application | ProjectEnumeration, status: number): boolean {
		if (appl === undefined) {
			return false;
		}

		return appl.project_application_status.includes(status);
	}

}
