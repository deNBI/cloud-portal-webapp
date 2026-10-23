import { Pipe, PipeTransform } from '@angular/core'
import { Application } from 'app/applications/application.model/application.model'
/**
 * Pipe to check if the form is clicked correctly regarding human data
 */
@Pipe({ name: 'sufficientHumanDataInformation', pure: false })
export class SufficientHumanDataInformationGivenPipe implements PipeTransform {
	transform(app: Application): boolean {
		if (app.project_application_person_related_data) {
			return (
				app.project_application_no_personal_data ||
				app.project_application_nonsensitive_data ||
				app.project_application_sensitive_data
			)
		} else if (app.project_application_public_person_related_data) {
			return this.checkForPathValidity(app.project_application_public_person_related_data_source)
		} else {
			return app.project_application_no_data_at_all
		}
	}

	checkForPathValidity(source: string): boolean {
		if (!source || source.trim() === '') {
			return false
		}

		const trimmed = source.trim()
		const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
		if (/^[a-z0-9+.-]+:\/\//i.test(trimmed)) {
			try {
				// Spezialfall für s3://, da der URL-Konstruktor S3-Syntax nativ nicht sauber parst
				if (trimmed.toLowerCase().startsWith('s3://')) {
					return trimmed.length > 5 && !/[<>|"\x00-\x1F\s]/.test(trimmed)
				}

				const url = new URL(trimmed)
				const allowedProtocols = ['http:', 'https:', 'ftp:', 'sftp:']

				if (!allowedProtocols.includes(url.protocol)) {
					return false
				}

				return domainRegex.test(url.hostname)
			} catch (e) {
				console.log(e)

				return false
			}
		}
		if (!trimmed.includes('\\') && trimmed.includes('.')) {
			try {
				// Wir hängen temporär ein Protokoll davor, damit der URL-Parser Port/Pfad sauber trennt
				const url = new URL(`http://${trimmed}`)

				return domainRegex.test(url.hostname) && !trimmed.includes(' ')
			} catch (e) {
				console.log(e)

				return false
			}
		}

		return false
	}
}
