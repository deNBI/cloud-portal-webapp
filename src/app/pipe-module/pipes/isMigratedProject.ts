import { Pipe, PipeTransform } from '@angular/core'
import { Application } from 'app/applications/application.model/application.model'

/**
 * Pipe which returns whether a certain project is migrated or marked for migration to SimpleVM-Platform.
 */
@Pipe({ name: 'isMigratedProject' })
export class IsMigratedProjectPipe implements PipeTransform {
	transform(projectApplication: Application) {
		return projectApplication.isMigrated()
	}
}
