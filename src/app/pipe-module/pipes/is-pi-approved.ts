import { Pipe, PipeTransform } from '@angular/core'
import { Application } from '../../applications/application.model/application.model'

/**
 * Pipe which checks if status is in list.
 */
@Pipe({
    name: 'isPiApproved',
    standalone: false
})
export class IsPiApprovedPipe implements PipeTransform {
	transform(appl: Application): boolean {
		if (appl === undefined) {
			return false
		}

		return appl.project_application_pi_approved
	}
}
