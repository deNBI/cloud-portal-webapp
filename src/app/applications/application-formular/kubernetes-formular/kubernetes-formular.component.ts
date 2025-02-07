import { Component } from '@angular/core'
import { ApplicationFormularComponent } from '../application-formular.component'

/**
 * This components provides the functions to create a new Kubernetes Cloud Application.
 */
@Component({
	selector: 'app-kubernetes-formular',
	templateUrl: 'kubernetes-formular.component.html',
	styleUrls: ['kubernetes-formular.component.css'],
	imports: [ApplicationFormularComponent]
})
export class KubernetesFormularComponent {
	openstack_application: boolean = true
	kubernetes_access: boolean = true

	title: string = 'New Kubernetes Application'
}
