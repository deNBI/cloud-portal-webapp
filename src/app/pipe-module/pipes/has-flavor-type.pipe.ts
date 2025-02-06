 
import { Pipe, PipeTransform } from '@angular/core'
import { Application } from 'app/applications/application.model/application.model'
import { FlavorTypeShortcuts } from 'app/shared/shared_modules/baseClass/flavor-type-shortcuts'
import { Flavor } from 'app/virtualmachines/virtualmachinemodels/flavor'
import { FlavorType } from 'app/virtualmachines/virtualmachinemodels/flavorType'

/**
 * Pipe which compares status.
 */
@Pipe({
    name: 'hasFlavorTypeOrIsNotCustom',
    standalone: false
})
export class HasFlavorTypeOrIsNotCustomPipe implements PipeTransform {
	transform(project: Application, flavorType: FlavorType): boolean {
		const hasFlavorTypeFlavor: boolean = project.flavors.some(
			(flavor: Flavor): boolean => flavor.type.shortcut === flavorType.shortcut
		)

		return hasFlavorTypeFlavor || flavorType.shortcut !== FlavorTypeShortcuts.CUSTOM_FLAVOR
	}
}
/**
 * Pipe which checks if status is in a list.
 */
@Pipe({
    name: 'statusInList',
    standalone: false
})
export class StatusInListPipe implements PipeTransform {
	transform(status: string, status_list_to_compare: string[]): boolean {
		return status_list_to_compare.indexOf(status) !== -1
	}
}
