import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Clusterinfo } from '../../clusters/clusterinfo';
import { VirtualmachineService } from '../../../api-connector/virtualmachine.service';

@Component({
	           selector: 'app-password-cluster',
	           templateUrl: '../password-cluster/password-cluster.component.html',
	           providers: [VirtualmachineService],
})
export class PasswordClusterComponent implements OnInit {

	cluster: Clusterinfo;
	password: string = null;
	public event: EventEmitter<any> = new EventEmitter();

	// eslint-disable-next-line no-empty-function
	constructor(public bsModalRef: BsModalRef, private clipboardService: ClipboardService, private virtualmachineservice: VirtualmachineService) {
	}

	ngOnInit() {
		this.generatePassword();
	}

	/**
	 * Copy some text to clipboard.
	 */
	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		}
	}

	generatePassword(): void {
		this.cluster.password = null;
		this.virtualmachineservice.generatePasswordCluster(this.cluster.cluster_id).subscribe((res: any) => {
			this.password = res['password'];

		});
	}

}
