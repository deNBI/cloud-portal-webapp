import { Pipe, PipeTransform } from '@angular/core'
import { ApplicationDissemination } from 'app/applications/application-dissemination'

/**
 * Pipe which returns counter of flavors.
 */
@Pipe({ name: 'getAllowedInformationForDissemination' })
export class AllowedDisseminationInformationPipe implements PipeTransform {
	transform(dissem: ApplicationDissemination): string {
		let final_string: string = ''
		if (dissem.platforms.length > 0) {
			final_string += 'Title'
			if (dissem.information_description_allowed) {
				final_string += ', Description'
			}
			if (dissem.information_resources) {
				final_string += ', Resources'
			}
			if (dissem.information_project_affiliation) {
				final_string += ', Project Affiliations'
			}
			if (dissem.information_project_type) {
				final_string += ', Project Type'
			}
			if (dissem.information_lifetime) {
				final_string += ', Lifetime'
			}
			if (dissem.information_pi_name) {
				final_string += ', PI Name'
			}
			if (dissem.information_institution) {
				final_string += ', Institution '
			}
			if (dissem.information_workgroup) {
				final_string += ', Work Group'
			}
			if (dissem.information_edam_terms) {
				final_string += ', EDAM-Terms'
			}

			return final_string
		} else {
			return 'No information allowed'
		}
	}
}
