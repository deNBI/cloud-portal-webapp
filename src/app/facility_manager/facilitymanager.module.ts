import {NgModule} from '@angular/core';
import {FacilityProjectsOverviewComponent} from '../facility_manager/facilityprojectsoverview.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {ImageTagComponent} from '../facility_manager/imagetags.component';
import {FacilitymanagerRoutingModule} from './facilitymanager-routing.module';
import {FacilityApplicationComponent} from './facility.application.component';
import {ResourcesComponent} from './resources/resources.component';
import {ApplicationBaseClass} from "../shared/shared_modules/baseClass/application-base-class";

/**
 * Facilitymanager module.
 */
@NgModule({
    imports: [
        FacilitymanagerRoutingModule,
        TabsModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot()

    ],
    declarations: [
        FacilityProjectsOverviewComponent,
        ImageTagComponent,
        FacilityApplicationComponent,
        ResourcesComponent,
        ApplicationBaseClass
    ]
})
export class FacilitymanagerModule {
}
