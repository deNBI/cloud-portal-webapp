import { Component } from '@angular/core'

/**
 * Component to create single vm applications.
 */
@Component({
    selector: 'app-addsimplevm',
    templateUrl: 'addsimplevm.component.html',
    standalone: false
})
export class AddsimplevmComponent {
	simple_vm_application: boolean = true
	title: string = 'New Simple Vm Application'
}
