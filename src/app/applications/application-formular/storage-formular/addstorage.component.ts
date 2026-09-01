import { Component, ChangeDetectionStrategy } from '@angular/core'
import { ApplicationFormularComponent } from '../application-formular.component'

/**
 * Component to create single vm applications.
 */
@Component({
	selector: 'app-addstorage',
	templateUrl: 'addstorage.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [ApplicationFormularComponent]
})
export class AddStorageComponent {
	storage_project: boolean = true
	title: string = 'New Storage Application'
}
