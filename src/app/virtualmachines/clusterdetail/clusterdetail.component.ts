import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Clusterinfo} from '../clusters/clusterinfo';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';

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
    this.activatedRoute.params.subscribe((paramsId: any) => {
      this.cluster_id = paramsId.id;
      this.setClusterById();
    });
  }

  deleteCluster(): void {
    this.virtualmachineService.deleteCluster(this.cluster_id).subscribe(() =>{
      this.cluster.status = 'Deleted'
    })
  }

  setClusterById(): void {
    this.virtualmachineService.getClusterInfo(this.cluster_id).subscribe((cluster_info: Clusterinfo) => {
      this.cluster = cluster_info;
      this.isLoaded = true;
    })
  }

}
