import { Pipe, PipeTransform } from '@angular/core'
import { Application } from '../../applications/application.model/application.model'
import { ProjectEnumeration } from '../../projectmanagement/project-enumeration'

@Pipe({
    name: 'hasstatusnotinlist',
    pure: false
})
export class HasStatusNotInListPipe implements PipeTransform {
	transform(appl: Application | ProjectEnumeration, status: number): boolean {
		if (appl === undefined) {
			return false
		}

		return !appl.project_application_statuses.includes(status)
	}
}
