import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Clusterinfo} from '../clusterinfo';
import {VirtualmachineService} from '../../../api-connector/virtualmachine.service';
import {VirtualMachineStates} from '../../virtualmachinemodels/virtualmachinestates';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';

/**
 * Clusterdetail component.
 */
@Component({
             selector: 'app-clusterdetail',
             templateUrl: './clusterdetail.component.html',
             styleUrls: ['./clusterdetail.component.scss'],
             providers: [VirtualmachineService]
           })
export class ClusterdetailComponent implements OnInit {
  cluster_id: string;
  cluster: Clusterinfo;
  isLoaded: boolean = false;
  notFoundCluster: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private virtualmachineService: VirtualmachineService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((paramsId: any): void => {
      this.cluster_id = paramsId.id;
      this.setClusterById();
    });
  }

  deleteCluster(): void {
    this.virtualmachineService.deleteCluster(this.cluster_id).subscribe((): void => {
      this.cluster.status = 'Deleted';
      this.cluster.master_instance.status = VirtualMachineStates.DELETED;
      this.cluster.worker_instances.forEach((vm: VirtualMachine): void => {
        vm.status = VirtualMachineStates.DELETED;
      })
    })
  }

  setClusterById(): void {
    this.virtualmachineService.getClusterInfo(this.cluster_id).subscribe((cluster_info: Clusterinfo): void => {
      this.cluster = cluster_info;
      this.isLoaded = true;
    })
  }

}
