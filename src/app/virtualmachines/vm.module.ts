import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ClickOutsideModule } from 'ng4-click-outside';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VmRoutingModule } from './vm_routing.module';
import { ImageDetailComponent } from './imagedetail.component';
import { VirtualMachineComponent } from './addvm.component';
import { FlavorDetailComponent } from './flavordetail.component';
import { VmOverviewComponent } from './vmOverview.component';
import { VolumeOverviewComponent } from './volumes/volumeOverview.component';
import { SnapshotOverviewComponent } from './snapshots/snapshotOverview.component';
import { PublicKeyModule } from '../shared/shared_modules/public-key/public-key.module';
import { BiocondaComponent } from './conda/bioconda.component';
import { SharedDirectivesModule } from '../shared/shared_modules/shared_directives.module';
import { ImageCarouselSlideComponent } from './imageCarouselSlide.component';
import { VmDetailComponent } from './vmdetail/vmdetail.component';
import { AddClusterComponent } from './clusters/add-cluster/add-cluster.component';
import { ResourceOverviewComponent } from './resource-overview/resource-overview.component';
import { ResEnvComponent } from './conda/res-env.component';
import { ClusterdetailComponent } from './clusters/clusterdetail/clusterdetail.component';
import { VirtualmachineinfoComponent } from './vmdetail/virtualmachineinfo/virtualmachineinfo.component';
import { VmstatusComponent } from './vmdetail/vmstatus/vmstatus.component';
import { ClusterOverviewComponent } from './clusters/clusteroverview/clusterOverview.component';
import { ClusterinfoComponent } from './clusters/clusterinfo/clusterinfo.component';
import { ClusterstatusComponent } from './clusters/clusterstatus/clusterstatus.component';
import { VolumStatusComponent } from './volumes/volum-status/volum-status.component';
import { PipeModuleModule } from '../pipe-module/pipe-module.module';
import { ProjectUserListComponent } from './project-user-list/project-user-list.component';
import { StopVmComponent } from './modals/stop-vm/stop-vm.component';
import { VmCardComponent } from './vmcard/vmcard.component';
import { ResumeVmComponent } from './modals/resume-vm/resume-vm.component';
import { ResumeClusterComponent } from './modals/resume-cluster/resume-cluster.component';
import { DeleteVmComponent } from './modals/delete-vm/delete-vm.component';
import { SnapshotVmComponent } from './modals/snapshot-vm/snapshot-vm.component';
import { VolumeVmComponent } from './modals/volume-vm/volume-vm.component';
import { RebootVmComponent } from './modals/reboot-vm/reboot-vm.component';
import { ClustercardComponent } from './clustercard/clustercard.component';
import { ScaleClusterComponent } from './modals/scale-cluster/scale-cluster.component';
import { DeleteClusterComponent } from './modals/delete-cluster/delete-cluster.component';
import { AddWorkshopComponent } from './workshop/add-workshop/add-workshop.component';
import { WorkshopOverviewComponent } from './workshop/workshop-overview/workshop-overview.component';
import { NewsModule } from '../news/news.module';
import { RecreateBackendVmComponent } from './modals/recreate-backend-vm/recreate-backend-vm.component';

/**
 * VM module.
 */
@NgModule({
	imports: [
		PipeModuleModule,
		ClickOutsideModule,
		PublicKeyModule,
		VmRoutingModule,
		TabsModule,
		CommonModule,
		FormsModule,
		ModalModule.forRoot(),
		PaginationModule.forRoot(),
		BsDropdownModule.forRoot(),
		CarouselModule,
		AccordionModule.forRoot(),
		SharedDirectivesModule,
		NgbModule,
		ReactiveFormsModule,
		NewsModule,
	],
	declarations: [
		ImageCarouselSlideComponent,
		ImageDetailComponent,
		VirtualMachineComponent,
		FlavorDetailComponent,
		VmOverviewComponent,
		VolumeOverviewComponent,
		SnapshotOverviewComponent,
		ClusterstatusComponent,
		BiocondaComponent,
		VmDetailComponent,
		AddClusterComponent,
		ResourceOverviewComponent,
		ResEnvComponent,
		ClusterinfoComponent,
		ClusterdetailComponent,
		ClusterOverviewComponent,
		VirtualmachineinfoComponent,
		VmstatusComponent,
		VolumStatusComponent,
		ProjectUserListComponent,
		VmCardComponent,
		StopVmComponent,
		RecreateBackendVmComponent,
		ResumeClusterComponent,
		ResumeVmComponent,
		DeleteVmComponent,
		SnapshotVmComponent,
		VolumeVmComponent,
		RebootVmComponent,
		ClustercardComponent,
		ScaleClusterComponent,
		DeleteClusterComponent,
		AddWorkshopComponent,
		WorkshopOverviewComponent,
	],
})
export class VmModule {}
