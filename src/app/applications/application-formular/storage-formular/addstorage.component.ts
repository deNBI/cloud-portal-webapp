import { Component } from '@angular/core'
import { ApplicationFormularComponent } from '../application-formular.component'

/**
 * Component to create single vm applications.
 */
@Component({
	selector: 'app-addstorage',
	templateUrl: 'addstorage.component.html',
	imports: [ApplicationFormularComponent]
})
export class AddStorageComponent {
	storage_application: boolean = true
	simplevm_application: boolean = false
	title: string = 'New Storage Application'
}
