import { Component, Input } from '@angular/core'
import { is_vo } from '../../../../globalvar'
import { Application } from '../../../../../applications/application.model/application.model'

@Component({
    selector: 'app-application-badges',
    templateUrl: './application-badges.component.html',
    styleUrls: ['./application-badges.component.scss'],
    standalone: false
})
export class ApplicationBadgesComponent {
	@Input() application: Application
	is_vo_admin: boolean = false
	simple_vm_logo: string = 'static/webapp/assets/img/simpleVM_Logo.svg'
	openstack_logo: string = 'static/webapp/assets/img/openstack_plain_red.svg'
	kubernetes_logo: string = 'static/webapp/assets/img/kubernetes_logo.svg'

	constructor() {
		this.is_vo_admin = is_vo
	}
}
