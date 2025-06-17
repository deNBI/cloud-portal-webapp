import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Application } from '../../../applications/application.model/application.model'
import { CreditsService } from '../../../api-connector/credits.service'
import { ApplicationsService } from '../../../api-connector/applications.service'
import { Flavor } from '../../../virtualmachines/virtualmachinemodels/flavor'
import { FlavorType } from '../../../virtualmachines/virtualmachinemodels/flavorType'
import { FlavorService } from '../../../api-connector/flavor.service'
import { FlavorTypeShortcuts } from '../../../shared/shared_modules/baseClass/flavor-type-shortcuts'
import { NgIf, NgStyle, NgClass, NgFor } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
	MinAmoutValidatorDirective,
	IntegerValidatorDirective,
	IntegerOrNullValidatorDirective
} from '../../../applications/numberValidations.directive'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { FlavorCounterPipe } from '../../../pipe-module/pipes/flavorcounter'
import { SufficientHumanDataInformationGivenPipe } from 'app/pipe-module/pipes/sufficient-data-information.pipe'

@Injectable({ providedIn: 'root' })
@Component({
	selector: 'app-application',
	templateUrl: './adjust-application.component.html',
	providers: [ApplicationsService],
	imports: [
		NgIf,
		FormsModule,
		NgStyle,
		MinAmoutValidatorDirective,
		IntegerValidatorDirective,
		NgClass,
		AccordionModule,
		NgFor,
		IntegerOrNullValidatorDirective,
		FlavorCounterPipe,
		SufficientHumanDataInformationGivenPipe
	]
})
export class AdjustApplicationComponent implements OnInit {
	bsModalRef = BsModalRef
	loaded: boolean = false
	loadedFlavorTypes: boolean = false
	loadedFlavors: boolean = false
	modalId: number | string | undefined
	totalNumberOfCores: number = 0
	newFlavors: {
		[id: string]: {
			counter: number
			flavor: Flavor
		}
	} = {}
	totalRAM: number = 0
	atLeastOneVM: boolean = false

	totalGPU: number = 0
	typeList: FlavorType[]
	flavorList: Flavor[] = []

	application: Application
	adjustedApplication: Application
	FlavorTypeShortcuts: typeof FlavorTypeShortcuts = FlavorTypeShortcuts

	@Output() eventSuccess: EventEmitter<boolean> = new EventEmitter()

	constructor(
		private modalService: BsModalService,
		private applicationsService: ApplicationsService,
		private creditsService: CreditsService,
		private flavorService: FlavorService
	) {}

	ngOnInit() {
		this.loaded = false
		this.loadedFlavorTypes = false
		this.loadedFlavors = false
		this.adjustedApplication = new Application(this.application)
		this.getAvailableFlavorTypes()
		this.getAvailableFlavors()

		this.checkIfMinimumSelected()
	}

	getAvailableFlavors() {
		this.flavorService
			.getListOfFlavorsAvailable(this.application.project_application_id, false, true)
			.subscribe((flavList: Flavor[]): void => {
				this.flavorList = flavList
				this.loadedFlavors = true
				this.loaded = this.loadedFlavorTypes && this.loadedFlavors
			})
	}

	getAvailableFlavorTypes() {
		this.flavorService.getListOfTypesAvailable().subscribe((availableTypes: FlavorType[]): void => {
			this.typeList = availableTypes
			this.loadedFlavorTypes = true
			this.loaded = this.loadedFlavorTypes && this.loadedFlavors
		})
	}

	calculateRamCores(): void {
		this.totalNumberOfCores = 0
		this.totalRAM = 0
		this.totalGPU = 0
		// tslint:disable-next-line:forin
		for (const extensionFlavorsKey in this.newFlavors) {
			const fl: any = this.newFlavors[extensionFlavorsKey]
			this.totalRAM += fl.flavor.ram_gib * fl.counter
			this.totalNumberOfCores += fl.flavor.vcpus * fl.counter
			this.totalGPU += fl.flavor.gpu * fl.counter
		}
	}

	checkIfTypeGotSimpleVMFlavorOrIsCustom(type: FlavorType): boolean {
		for (const flav of this.flavorList) {
			if (
				(flav.type.shortcut === type.shortcut && flav.simple_vm) ||
				type.shortcut === FlavorTypeShortcuts.CUSTOM_FLAVOR
			) {
				return true
			}
		}

		return false
	}

	togglePersonalDataType(checked: boolean, data_type: string) {
		switch (data_type) {
			case 'person_related': {
				if (!checked) {
					this.adjustedApplication.project_application_no_personal_data = false
					this.adjustedApplication.project_application_nonsensitive_data = false
					this.adjustedApplication.project_application_sensitive_data = false
				} else {
					this.adjustedApplication.project_application_no_data_at_all = false
				}
				break
			}
			case 'no_personal_data': {
				if (checked) {
					this.adjustedApplication.project_application_nonsensitive_data = false
					this.adjustedApplication.project_application_sensitive_data = false
					this.adjustedApplication.project_application_no_data_at_all = false
				}
				break
			}
			case 'nonsensitive': {
				if (checked) {
					this.adjustedApplication.project_application_no_personal_data = false
					this.adjustedApplication.project_application_no_data_at_all = false
				}
				break
			}
			case 'sensitive': {
				if (checked) {
					this.adjustedApplication.project_application_no_personal_data = false
					this.adjustedApplication.project_application_no_data_at_all = false
				}
				break
			}
			case 'no_at_all': {
				if (checked) {
					this.adjustedApplication.project_application_no_data_at_all = true
					this.adjustedApplication.project_application_no_personal_data = false
					this.adjustedApplication.project_application_sensitive_data = false
					this.adjustedApplication.project_application_nonsensitive_data = false
					this.adjustedApplication.project_application_person_related_data = false
				}
				break
			}
			default:
				break
		}
	}

	hide(): void {
		this.modalService.hide(this.modalId)
	}

	checkIfMinimumSelected(): void {
		let numberOfVMs: number = 0
		for (const fl of this.adjustedApplication.flavors) {
			numberOfVMs += this.adjustedApplication.getFlavorCounter(fl)
		}
		this.atLeastOneVM = numberOfVMs > 0 || this.adjustedApplication.project_application_openstack_project
	}

	onChangeFlavor(flavor: Flavor, value: number): void {
		this.adjustedApplication.setFlavorInFlavors(flavor, value)
		this.checkIfMinimumSelected()
		this.creditsService
			.getCreditsForApplication(this.adjustedApplication.flavors, this.adjustedApplication.project_application_lifetime)
			.toPromise()
			.then((credits: number): void => {
				this.adjustedApplication.project_application_initial_credits = credits
			})
			.catch((err: any): void => console.log(err))
	}

	showAdjustApplicationModal(application: Application): EventEmitter<boolean> {
		const initialState = {
			application
		}
		const bsModalRef: BsModalRef = this.modalService.show(AdjustApplicationComponent, { initialState })
		bsModalRef.setClass('modal-xl')
		this.modalId = bsModalRef.id

		return bsModalRef.content.eventSuccess
	}

	adjustApplication(): void {
		this.loaded = false
		this.applicationsService.adjustApplication(this.adjustedApplication).subscribe(
			(): void => {
				this.hide()

				this.eventSuccess.emit(true)
			},
			(): void => {
				this.hide()

				this.eventSuccess.emit(false)
			}
		)
	}
}
