import {Component} from '@angular/core';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component({
             selector: 'app-addcloudapplication',
             templateUrl: 'addcloudapplication.component.html',
             styleUrls: ['addcloudapplication.component.css']
           })

export class AddcloudapplicationComponent {
  /**
   * If it is a openstack application.
   */
  openstack_application: boolean = true;

  /**
   * Title of the the component.
   */
  title: string = 'New OpenStack Application';

}
