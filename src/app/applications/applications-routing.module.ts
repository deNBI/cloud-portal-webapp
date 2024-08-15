import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ApplicationsComponent } from './applications.component'

import { AddsimplevmComponent } from './application-formular/simplevm-formular/addsimplevm.component'
import { AddcloudapplicationComponent } from './application-formular/openstack-formular/addcloudapplication.component'
import { TypeOverviewComponent } from './type-overview.component'
import { ValidationApplicationComponent } from '../validation-application/validation-application.component'
import { KubernetesFormularComponent } from './application-formular/kubernetes-formular/kubernetes-formular.component'
import { VoGuardService } from '../shared/guards/vo-guard.service'

const routes: Routes = [
	{
		path: '',
		component: ApplicationsComponent,
		data: {
			title: 'Application overview'
		}
	},
	{
		path: 'newCloudApplication',
		component: AddcloudapplicationComponent,
		data: {
			title: 'New OpenStack Application'
		}
	},
	{
		path: 'newKubernetesApplication',
		component: KubernetesFormularComponent,
		canActivate: [VoGuardService],
		data: {
			title: 'New Kubernetes Application'
		}
	},
	{
		path: 'newSimpleVmApplication',
		component: AddsimplevmComponent,
		data: {
			title: 'New SimpleVM Application'
		}
	},
	{
		path: 'type-overview',
		component: TypeOverviewComponent,
		data: {
			title: 'Project Types Overview'
		}
	},
	{
		path: 'validation/:hash',
		component: ValidationApplicationComponent,
		data: {
			title: 'Application Validation'
		}
	}
]

/**
 * Application routing module.
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ApplicationsRoutingModule {}
