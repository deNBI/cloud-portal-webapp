import { Component } from '@angular/core';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component({
	selector: 'app-addcloudapplication',
	templateUrl: 'addcloudapplication.component.html',
	styleUrls: ['addcloudapplication.component.css'],
})

export class AddcloudapplicationComponent {
	openstack_application: boolean = true;

	title: string = 'New OpenStack Application';

}
