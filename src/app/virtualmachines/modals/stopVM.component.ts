import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { VirtualmachineService } from '../../api-connector/virtualmachine.service';
import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';

@Component({
	selector: 'app-stop-vm',
	templateUrl: './stopVM.component.html',
	providers: [VirtualmachineService],
})
export class StopVMComponent implements OnInit, OnDestroy {

	virtualMachine: VirtualMachine;
	private subscription: Subscription = new Subscription();
	public event: EventEmitter<any> = new EventEmitter();

	ngOnInit() {
	}

	ngOnDestroy() {
	}
}
