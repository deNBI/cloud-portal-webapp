import { NgModule } from '@angular/core'

import { TabsModule } from 'ngx-bootstrap/tabs'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgSelectModule } from '@ng-select/ng-select'
import { BadgeModule, TableDirective } from '@coreui/angular'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { ApplicationsComponent } from './applications.component'
import { ApplicationsRoutingModule } from './applications-routing.module'
import { AddsimplevmComponent } from './application-formular/simplevm-formular/addsimplevm.component'
import { AddcloudapplicationComponent } from './application-formular/openstack-formular/addcloudapplication.component'
import { TypeOverviewComponent } from './type-overview.component'
import { ValidationApplicationComponent } from '../validation-application/validation-application.component'
import { ApplicationDetailComponent } from './application-detail/application-detail.component'
import { SharedDirectivesModule } from '../shared/shared_modules/shared_directives.module'
import { ApplicationFormularComponent } from './application-formular/application-formular.component'
import { PipeModuleModule } from '../pipe-module/pipe-module.module'
import { ApplicationPiDetailComponent } from './application-detail/application-pi-detail/application-pi-detail.component'
import { InformationDetailComponent } from './application-detail/information-detail/information-detail.component'
import { AdjustmentDetailComponent } from './application-detail/adjustment-detail/adjustment-detail.component'
import { ResourceDetailComponent } from './application-detail/resource-detail/resource-detail.component'
import { ModificationDetailComponent } from './application-detail/modification-detail/modification-detail.component'
import { CreditsExtensionDetailComponent } from './application-detail/credits-extension-detail/credits-extension-detail.component'
import { LifetimeExtensionDetailComponent } from './application-detail/lifetime-extension-detail/lifetime-extension-detail.component'
import { NewsModule } from '../news/news.module'
import { SharedModuleModule } from '../shared/shared_modules/shared-module.module'
import { KubernetesFormularComponent } from './application-formular/kubernetes-formular/kubernetes-formular.component'

import { ApplicationListComponent } from './application-list/application-list.component'
import { ApplicationCardComponent } from './application-card/application-card.component'
import { ApplicationVoActionsComponent } from './application-vo-actions/application-vo-actions.component'
import { ApplicationFacilityActionsComponent } from './application-facility-actions/application-facility-actions.component'

/**
 * Applications Module.
 */
@NgModule({
	imports: [
		AccordionModule.forRoot(),
		ApplicationsRoutingModule,
		TabsModule,
		CommonModule,
		FormsModule,
		ModalModule.forRoot(),
		SharedDirectivesModule,
		PipeModuleModule,
		NewsModule,
		NgSelectModule,
		BadgeModule,
		SharedModuleModule,
		TableDirective,
		TooltipModule
	],
	declarations: [
		ApplicationsComponent,
		AddsimplevmComponent,
		AddcloudapplicationComponent,
		KubernetesFormularComponent,
		TypeOverviewComponent,
		ValidationApplicationComponent,
		ApplicationDetailComponent,
		ApplicationFormularComponent,
		ApplicationPiDetailComponent,
		InformationDetailComponent,
		ResourceDetailComponent,
		ModificationDetailComponent,
		CreditsExtensionDetailComponent,
		LifetimeExtensionDetailComponent,
		AdjustmentDetailComponent,
		ApplicationListComponent,
		ApplicationCardComponent,
		ApplicationVoActionsComponent,
		ApplicationFacilityActionsComponent
	],
	exports: [ApplicationDetailComponent, ApplicationListComponent]
})
export class ApplicationsModule {}
