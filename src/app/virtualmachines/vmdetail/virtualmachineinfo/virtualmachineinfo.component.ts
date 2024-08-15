import { Component, Input, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core'
import { UserService } from 'app/api-connector/user.service'
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates'
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine'

/**
 * Virtualmachine info component
 */
@Component({
	selector: 'app-virtualmachineinfo',
	templateUrl: './virtualmachineinfo.component.html',
	styleUrls: ['./virtualmachineinfo.component.scss'],

	providers: [UserService]
})
export class VirtualmachineinfoComponent implements OnChanges, OnInit {
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates()
	@Input() virtualMachine: VirtualMachine
	@Input() cluster_machine: boolean = false

	userName: string = ''
	userSurname: string = ''

	constructor(
		private userService: UserService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.userService = userService
		this.changeDetectorRef = changeDetectorRef
	}

	ngOnInit(): void {
		if (this.virtualMachine) {
			if (this.virtualMachine.still_used_confirmed_user_id) {
				this.userService
					.getMemberDetailsByElixirId(this.virtualMachine.still_used_confirmed_user_id)
					.subscribe((result: any) => {
						this.userName = result['firstName']
						this.userSurname = result['lastName']
						this.changeDetectorRef.detectChanges()
					})
			}
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		const { changedVM } = changes
		console.log(changedVM)
		if (changedVM) {
			if (changedVM['virtualMachine']['currentValue']['still_used_confirmed_user_id']) {
				this.userService
					.getMemberDetailsByElixirId(this.virtualMachine.still_used_confirmed_user_id)
					.subscribe((result: any) => {
						this.userName = result['firstName']
						this.userSurname = result['lastName']
						this.changeDetectorRef.detectChanges()
					})
			}
		}
	}
}
