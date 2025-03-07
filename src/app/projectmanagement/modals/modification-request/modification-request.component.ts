import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { HasFlavorTypeOrIsNotCustomPipe } from 'app/pipe-module/pipes/has-flavor-type.pipe'
import { ApplicationModification } from '../../../applications/application_modification.model'
import { ResultComponent } from '../result/result.component'
import { Application } from '../../../applications/application.model/application.model'
import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links'
import { FlavorType } from '../../../virtualmachines/virtualmachinemodels/flavorType'
import { Flavor } from '../../../virtualmachines/virtualmachinemodels/flavor'
import { FlavorService } from '../../../api-connector/flavor.service'
import { CreditsService } from '../../../api-connector/credits.service'
import { ShownFlavors } from 'app/shared/classes/shownFlavors.interface'
import { FormsModule } from '@angular/forms'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { NgFor, NgIf, NgClass } from '@angular/common'
import {
	MinAmoutValidatorDirective,
	IntegerValidatorDirective
} from '../../../applications/numberValidations.directive'
import { FlavorCounterPipe } from '../../../pipe-module/pipes/flavorcounter'
import { HasFlavorTypeOrIsNotCustomPipe as HasFlavorTypeOrIsNotCustomPipe_1 } from '../../../pipe-module/pipes/has-flavor-type.pipe'

@Component({
	selector: 'app-modification-request',
	templateUrl: './modification-request.component.html',
	styleUrls: ['./modification-request.component.scss'],
	providers: [FlavorService, CreditsService, HasFlavorTypeOrIsNotCustomPipe],
	imports: [
		FormsModule,
		AccordionModule,
		NgFor,
		NgIf,
		NgClass,
		MinAmoutValidatorDirective,
		IntegerValidatorDirective,
		FlavorCounterPipe,
		HasFlavorTypeOrIsNotCustomPipe_1
	]
})
export class ModificationRequestComponent implements OnInit, OnDestroy {
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL

	project: Application
	preSavedModification: ApplicationModification
	preSavedAdjustment: ApplicationModification
	temp_project_modification: ApplicationModification

	adjusted_project_modification: ApplicationModification
	flavorRetrievalInProgress: boolean = false

	expected_total_credits: number = 0
	flavorTypes: FlavorType[] = []
	shown_flavors: ShownFlavors = {}
	min_vm: boolean = true

	min_vm_adjusted: boolean = true

	adjustment: boolean = false

	private subscription: Subscription = new Subscription()
	public event: EventEmitter<any> = new EventEmitter()
	submitted: boolean = false
	extraResourceCommentRequired: boolean = false
	GPU_SHORTCUT = 'GPU'
	HMF_SHORTCUT = 'HMF'

	constructor(
		public bsModalRef: BsModalRef,
		private modalService: BsModalService,
		private flavorService: FlavorService,
		private creditsService: CreditsService,
		private cdRef: ChangeDetectorRef
	) {
		// do nothing.
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
		if (!this.submitted) {
			this.event.emit({ reload: false })
		}
	}

	ngOnInit(): void {
		this.subscription.add(
			this.flavorService.getListOfTypesAvailable().subscribe((result: FlavorType[]) => {
				this.flavorTypes = result
				for (const flavorType of this.flavorTypes) {
					this.shown_flavors[flavorType.long_name] = {}
				}
				this.getFlavors()
			})
		)
		if (this.project.project_modification_request) {
			this.temp_project_modification = new ApplicationModification(this.project.project_modification_request)
			this.temp_project_modification.flavors = []
			this.temp_project_modification.flavors = this.project.project_modification_request.flavors.map(
				(flavor: Flavor): Flavor => new Flavor(flavor)
			)
		} else {
			this.temp_project_modification = new ApplicationModification()
			this.temp_project_modification.setByApp(this.project)
		}

		if (this.adjustment) {
			this.adjusted_project_modification = new ApplicationModification(this.project.project_modification_request)
			this.adjusted_project_modification.flavors = []
			this.adjusted_project_modification.flavors = this.project.project_modification_request.flavors.map(
				(flavor: Flavor): Flavor => new Flavor(flavor)
			)
		}

		this.checkExtraResourceCommentRequired()
	}

	checkValidityComment(): boolean {
		if (this.extraResourceCommentRequired) {
			if (this.temp_project_modification.comment.length < 50) {
				return false
			} else {
				const regExp = /[a-zA-Z]/g

				return regExp.test(this.temp_project_modification.comment)
			}
		} else {
			return true
		}
	}

	getFlavors(): void {
		this.flavorRetrievalInProgress = true
		this.subscription.add(
			this.flavorService
				.getListOfFlavorsAvailable(this.project.project_application_id.toString(), true, this.adjustment)
				.subscribe((flavors: Flavor[]): void => {
					this.temp_project_modification.flavors = []
					for (const flavor of flavors) {
						if (this.project.project_application_openstack_project || flavor.simple_vm) {
							if (flavor.name in this.shown_flavors[flavor.type.long_name]) {
								this.shown_flavors[flavor.type.long_name][flavor.name].push(flavor)
							} else {
								this.shown_flavors[flavor.type.long_name][flavor.name] = [flavor]
							}
						}
					}
					this.flavorRetrievalInProgress = false

					this.checkFlavorDifferences()
				})
		)
	}

	getFlavorNamesByType(type: FlavorType): string[] {
		const names: string[] = Object.keys(this.shown_flavors[type.long_name])

		return names
	}

	checkFlavorDifferences(): void {
		for (const flavor of this.project.flavors) {
			const idx: number = this.shown_flavors[flavor.type.long_name][flavor.name].findIndex(
				(fl: Flavor): boolean => fl.name === flavor.name
			)
			// not in shown_flavors, so flavor only for project
			if (idx < 0) {
				const disabled_flavor: Flavor = new Flavor(flavor)
				disabled_flavor.setDisabled(true)
				const mod_flavor: Flavor = new Flavor(flavor)
				this.shown_flavors[mod_flavor.type.long_name][mod_flavor.name].push(mod_flavor)
				this.shown_flavors[disabled_flavor.type.long_name][disabled_flavor.name].push(disabled_flavor)
				this.temp_project_modification.flavors.push(mod_flavor)
			} else {
				// else in shown_flavors, may be different than old one
				this.shown_flavors[flavor.type.long_name][flavor.name][idx].counter = flavor.counter
				const mod_flavor: Flavor = new Flavor(this.shown_flavors[flavor.type.long_name][flavor.name][idx])
				this.temp_project_modification.flavors.push(mod_flavor)
				this.shown_flavors[mod_flavor.type.long_name][mod_flavor.name].splice(idx, 0, mod_flavor)
				this.shown_flavors[mod_flavor.type.long_name][mod_flavor.name][idx].setDisabled(true)
			}
		}
		this.buildMissingFlavorPairs()

		if (this.preSavedModification) {
			this.temp_project_modification = new ApplicationModification(this.preSavedModification)
		}
		if (this.preSavedAdjustment) {
			this.adjusted_project_modification = new ApplicationModification(this.preSavedAdjustment)
		}
		this.temp_project_modification.calculateRamCores()
	}

	buildMissingFlavorPairs(): void {
		const copyOfShownFlavors: ShownFlavors = this.shown_flavors

		for (const flavorType of Object.keys(copyOfShownFlavors)) {
			for (const flavorName of Object.keys(copyOfShownFlavors[flavorType])) {
				const tempFlavors: Flavor[] = copyOfShownFlavors[flavorType][flavorName]
				if (tempFlavors.length === 1) {
					const generatedFlavor: Flavor = new Flavor(tempFlavors[0])
					generatedFlavor.setDisabled(!generatedFlavor.disabled)
					if (generatedFlavor.disabled) {
						this.shown_flavors[flavorType][flavorName].unshift(generatedFlavor)
					} else {
						this.shown_flavors[flavorType][flavorName].push(generatedFlavor)
					}
				}
			}
		}
	}

	checkFlavorPairs(flavor: Flavor, event: any): void {
		const amount: number = Number(event.target.value)
		const idx: number = this.temp_project_modification.flavors.findIndex(
			(fl: Flavor): boolean => fl.name === flavor.name
		)
		if (idx >= 0) {
			this.temp_project_modification.flavors.splice(idx, 1)
			if (amount > 0) {
				flavor.counter = amount
				this.temp_project_modification.flavors.push(flavor)
			}
		} else if (amount > 0) {
			flavor.counter = amount
			this.temp_project_modification.flavors.push(flavor)
		}
		this.min_vm =
			this.project.project_application_openstack_project || this.temp_project_modification.flavors.length > 0
		this.temp_project_modification.calculateRamCores()
		this.getExtraCredits()
		this.checkExtraResourceCommentRequired()
	}

	checkExtraResourceCommentRequired(): void {
		this.extraResourceCommentRequired = this.compareCriticalResourceValues()
		this.cdRef.detectChanges()
	}

	/**
	 * Return dict with values for calculation of resource differences in the context of modification requests
	 * @param shortcut the shortcut of the flavor type that shall be checked
	 * @param current determines if the values returned shall be the actual application values or the modification values
	 */
	calculateResourcesByType(shortcut: string, current: boolean): any {
		// eslint-disable-next-line prefer-const
		let dict: any = {
			total_cores: 0,
			total_ram: 0,
			total_gpus: 0,
			machines: 0
		}
		let correspondingProject: Application | ApplicationModification
		if (current) {
			correspondingProject = this.project
		} else {
			correspondingProject = this.temp_project_modification
		}
		for (const flavor of correspondingProject.flavors) {
			if (flavor?.type.shortcut.toUpperCase() === shortcut) {
				dict.total_cores += flavor.counter * flavor.vcpus
				dict.total_ram += flavor.counter * flavor.ram_mb
				dict.machines += flavor.counter
				if (flavor?.type?.shortcut.toUpperCase() === this.GPU_SHORTCUT) {
					dict.total_gpus += flavor.counter * flavor.gpu
				}
			}
		}

		return dict
	}

	/**
	 * checks whether the user tries to apply for more critical resources in the application
	 */
	compareCriticalResourceValues(): boolean {
		const currentHMF: any = this.calculateResourcesByType(this.HMF_SHORTCUT, true)
		const currentGPU: any = this.calculateResourcesByType(this.GPU_SHORTCUT, true)
		const requestingHMF: any = this.calculateResourcesByType(this.HMF_SHORTCUT, false)
		const requestingGPU: any = this.calculateResourcesByType(this.GPU_SHORTCUT, false)

		return (
			this.isMoreCriticalResources(currentHMF, requestingHMF) || this.isMoreCriticalResources(currentGPU, requestingGPU)
		)
	}

	isMoreCriticalResources(current: any, requesting: any): boolean {
		for (const key in current) {
			if (requesting[key] > current[key]) {
				return true
			}
		}

		return false
	}

	checkFlavorPairsAdjustment(flavor: Flavor, event: any): void {
		const amount: number = Number(event.target.value)
		const idx: number = this.adjusted_project_modification.flavors.findIndex(
			(fl: Flavor): boolean => fl.name === flavor.name
		)
		if (idx >= 0) {
			this.adjusted_project_modification.flavors.splice(idx, 1)
			if (amount > 0) {
				flavor.counter = amount
				this.adjusted_project_modification.flavors.push(flavor)
			}
		} else if (amount > 0) {
			flavor.counter = amount
			this.adjusted_project_modification.flavors.push(flavor)
		}
		this.min_vm_adjusted =
			this.project.project_application_openstack_project || this.adjusted_project_modification.flavors.length > 0
		this.adjusted_project_modification.calculateRamCores()
	}

	getExtraCredits(): void {
		if (!this.project.credits_allowed) {
			return
		}

		this.subscription.add(
			this.creditsService
				.getExtraCreditsForResourceExtension(
					this.temp_project_modification.flavors,
					this.project.project_application_id.toString()
				)
				.subscribe((credits: number): void => {
					this.temp_project_modification.extra_credits = credits
					this.expected_total_credits =
						this.project.project_application_initial_credits + this.temp_project_modification.extra_credits
					if (this.expected_total_credits <= 0) {
						this.expected_total_credits = 0
					}
				})
		)
	}

	showSubmitModal(adjustment: boolean): void {
		let initialState: object
		if (adjustment) {
			initialState = {
				project: this.project,
				extension: this.temp_project_modification,
				adjustedModification: this.adjusted_project_modification,
				modificationExtension: true,
				expectedTotalCredits: this.expected_total_credits
			}
		} else {
			initialState = {
				project: this.project,
				extension: this.temp_project_modification,
				modificationExtension: true,
				expectedTotalCredits: this.expected_total_credits
			}
		}
		this.submitted = true
		this.bsModalRef = this.modalService.show(ResultComponent, {
			initialState,
			class: 'modal-lg modal-dialog-scrollable '
		})

		this.bsModalRef.content.event.subscribe((result: any) => {
			if ('reload' in result && result['reload']) {
				if (adjustment) {
					this.event.emit({ action: 'adjustedModificationRequest' })
				} else {
					this.event.emit({ reload: true })
				}
			} else if ('enterData' in result) {
				if (adjustment) {
					this.event.emit({
						backToInput: true,
						adjustedModification: this.adjusted_project_modification
					})
				} else {
					this.event.emit({
						backToInput: true,
						modification: this.temp_project_modification
					})
				}
			} else {
				this.event.emit({ reload: false })
			}
		})
	}
}
