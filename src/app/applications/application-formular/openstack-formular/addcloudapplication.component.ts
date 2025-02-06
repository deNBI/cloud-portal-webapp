import { Component } from '@angular/core'
import { ApplicationFormularComponent } from '../application-formular.component';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component({
    selector: 'app-addcloudapplication',
    templateUrl: 'addcloudapplication.component.html',
    styleUrls: ['addcloudapplication.component.css'],
    imports: [ApplicationFormularComponent]
})
export class AddcloudapplicationComponent {
	openstack_application: boolean = true

	title: string = 'New OpenStack Application'
}
