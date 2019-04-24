import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';


@Component(***REMOVED***
    selector: 'app-type-overview',
    templateUrl: './type-overview.component.html',
    styleUrls: ['./type-overview.component.css']
***REMOVED***)
export class TypeOverviewComponent implements OnInit ***REMOVED***

    simpleVM_logo_link: String;
    simpleVM_ease_logo: String;
    simpleVM_curve_logo: String;
    simpleVM_remote_logo: String;

    openstack_logo_link: String;
    openstack_api_logo: String;
    openstack_conf_logo: String;
    openstack_scale_logo: String;
    static_img_folder: String = 'static/webapp/assets/img/';

    constructor() ***REMOVED*** ***REMOVED***

    ngOnInit(): any ***REMOVED***
        this.simpleVM_logo_link = `$***REMOVED***this.static_img_folder***REMOVED***simpleVM_Logo.svg`;
        this.simpleVM_curve_logo = `$***REMOVED***this.static_img_folder***REMOVED***/simplevm-info-page/flatlearning.svg`;
        this.simpleVM_ease_logo = `$***REMOVED***this.static_img_folder***REMOVED***/simplevm-info-page/easytouse.svg`;
        this.simpleVM_remote_logo = `$***REMOVED***this.static_img_folder***REMOVED***/simplevm-info-page/remote.svg`;

        this.openstack_logo_link = `$***REMOVED***this.static_img_folder***REMOVED***openstack_plain_red.svg`;
        this.openstack_api_logo = `$***REMOVED***this.static_img_folder***REMOVED***/openstack-info-page/api.svg`;
        this.openstack_conf_logo = `$***REMOVED***this.static_img_folder***REMOVED***/openstack-info-page/configuration.svg`;
        this.openstack_scale_logo = `$***REMOVED***this.static_img_folder***REMOVED***/openstack-info-page/scale.svg`;
    ***REMOVED***


***REMOVED***
