import { Component, OnInit } from '@angular/core'

import { WIKI_WORKSHOPS, OPENSTACK_LINK, PROJECT_TYPES_LINK, SIMPLE_VM_LINK } from '../../links/links'
import { is_vo } from '../shared/globalvar'

/**
 * The type overview of the different project classes.
 */
@Component({
	selector: 'app-type-overview',
	templateUrl: './type-overview.component.html',
	styleUrls: ['./type-overview.component.css']
})
export class TypeOverviewComponent implements OnInit {
	title: string = 'Project Type Overview'
	openstack_color: string = '#ed1944'
	simplevm_color: string = '#00adef'
	kubernetes_color: string = '#326ce5'
	is_vo_admin: boolean = is_vo

	simpleVM_logo_link: string
	simpleVM_ease_logo: string
	simpleVM_curve_logo: string
	simpleVM_remote_logo: string

	kubernetes_logo_link: string
	kubernetes_logo_border: string

	openstack_logo_link: string
	openstack_api_logo: string
	openstack_conf_logo: string
	openstack_scale_logo: string
	static_img_folder: string = 'static/webapp/assets/img/'

	WIKI_WORKSHOPS: string = WIKI_WORKSHOPS
	SIMPLE_VM_LINK: string = SIMPLE_VM_LINK
	PROJECT_TYPES_LINK: string = PROJECT_TYPES_LINK
	OPENSTACK_LINK: string = OPENSTACK_LINK

	ngOnInit(): any {
		this.simpleVM_logo_link = `${this.static_img_folder}simpleVM_Logo.svg`
		this.simpleVM_curve_logo = `${this.static_img_folder}simplevm-info-page/flatlearning.svg`
		this.simpleVM_ease_logo = `${this.static_img_folder}simplevm-info-page/easytouse.svg`
		this.simpleVM_remote_logo = `${this.static_img_folder}simplevm-info-page/remote.svg`

		this.kubernetes_logo_link = `${this.static_img_folder}kubernetes_logo.svg`
		this.kubernetes_logo_border = `${this.static_img_folder}kubernetes_logo_border.svg`

		this.openstack_logo_link = `${this.static_img_folder}openstack_plain_red.svg`
		this.openstack_api_logo = `${this.static_img_folder}openstack-info-page/api.svg`
		this.openstack_conf_logo = `${this.static_img_folder}openstack-info-page/configuration.svg`
		this.openstack_scale_logo = `${this.static_img_folder}openstack-info-page/scale.svg`
	}
}
