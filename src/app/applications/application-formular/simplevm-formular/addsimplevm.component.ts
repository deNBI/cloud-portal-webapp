import { Component, ChangeDetectionStrategy } from '@angular/core'
import { ApplicationFormularComponent } from '../application-formular.component'

/**
 * Component to create single vm applications.
 */
@Component({
	selector: 'app-addsimplevm',
	templateUrl: 'addsimplevm.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [ApplicationFormularComponent]
})
export class AddsimplevmComponent {
	simple_vm_application: boolean = true
	title: string = 'New Simple Vm Application'
}
