import { Component, OnInit } from '@angular/core';
import {
	WIKI_WORKSHOPS, OPENSTACK_LINK, PROJECT_TYPES_LINK, SIMPLE_VM_LINK
} from '../../links/links';

/**
 * The type overview of the different project classes.
 */
@Component({
	selector: 'app-type-overview',
	templateUrl: './type-overview.component.html',
	styleUrls: ['./type-overview.component.css'],
})
export class TypeOverviewComponent implements OnInit {

	title: string = 'Project Type Overview';

	simpleVM_logo_link: String;
	simpleVM_ease_logo: String;
	simpleVM_curve_logo: String;
	simpleVM_remote_logo: String;

	openstack_logo_link: String;
	openstack_api_logo: String;
	openstack_conf_logo: String;
	openstack_scale_logo: String;
	static_img_folder: String = 'static/webapp/assets/img/';

	WIKI_WORKSHOPS: string = WIKI_WORKSHOPS;
	SIMPLE_VM_LINK: string = SIMPLE_VM_LINK;
	PROJECT_TYPES_LINK: string = PROJECT_TYPES_LINK;
	OPENSTACK_LINK: string = OPENSTACK_LINK;

	ngOnInit(): any {
		this.simpleVM_logo_link = `${this.static_img_folder}simpleVM_Logo.svg`;
		this.simpleVM_curve_logo = `${this.static_img_folder}/simplevm-info-page/flatlearning.svg`;
		this.simpleVM_ease_logo = `${this.static_img_folder}/simplevm-info-page/easytouse.svg`;
		this.simpleVM_remote_logo = `${this.static_img_folder}/simplevm-info-page/remote.svg`;

		this.openstack_logo_link = `${this.static_img_folder}openstack_plain_red.svg`;
		this.openstack_api_logo = `${this.static_img_folder}/openstack-info-page/api.svg`;
		this.openstack_conf_logo = `${this.static_img_folder}/openstack-info-page/configuration.svg`;
		this.openstack_scale_logo = `${this.static_img_folder}/openstack-info-page/scale.svg`;
	}

}
