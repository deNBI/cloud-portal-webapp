import { Flavor } from './flavor'
import { Client } from '../../vo_manager/clients/client.model'
import { ImageMode } from '../../facility_manager/image-tag'
import { Clusterinfo } from '../clusters/clusterinfo'
import { Volume } from '../volumes/volume'

/**
 * Virtualmachine class.
 */
export class VirtualMachine {
	flavor: Flavor
	image: string
	project: string
	status: string
	keyname: string
	name: string
	client: Client
	openstackid: string
	created_at_date: string
	still_used_confirmation_requested_date: Date

	elixir_id: string

	application_id: string
	cardState: number
	cluster: Clusterinfo
	projectid: number

	modes: ImageMode[]
	volumes: Volume[]
	error_msg: string
	msg: string
	days_running: number

	constructor(vm?: Partial<VirtualMachine>) {
		Object.assign(this, vm)
		this.cardState = 0
		if (vm) {
			if (vm.flavor) {
				this.flavor = new Flavor(vm.flavor)
			}
			if (vm.client) {
				this.client = new Client(vm.client)
			}
			if (vm.cluster) {
				this.cluster = new Clusterinfo(vm.cluster)
			}
			this.volumes = []
			if (vm.volumes) {
				for (const volume of vm.volumes) {
					this.volumes.push(new Volume(volume))
				}
			}
		}
		this.getTerminationStartDateString()
		if (this.days_running === null) {
			this.days_running = this.calculateDaysRunning()
		}
	}

	public calculateDaysRunning(): number {
		const createdDate: Date = new Date(this.created_at_date)

		return Math.floor((Date.now() - createdDate.getTime()) / 86400000)
	}

	public getTerminationStartDateString(): string {
		if (
			this.still_used_confirmation_requested_date === null ||
			this.still_used_confirmation_requested_date === undefined
		) {
			return ''
		}

		this.still_used_confirmation_requested_date = new Date(
			Date.parse(this.still_used_confirmation_requested_date.toString())
		)
		const term_date: Date = new Date(this.still_used_confirmation_requested_date.getTime() + 1000 * 60 * 60 * 24 * 14)

		return term_date.toLocaleDateString()
	}
}
