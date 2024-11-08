import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { TESTIMONIAL_PAGE_LINK, CLOUD_PORTAL_SUPPORT_MAIL, SINGLE_TESTIMONIAL_PAGE_LINK } from '../../../../links/links'
import { NewsService } from '../../../api-connector/news.service'
import { Application } from '../../../applications/application.model/application.model'
import { SocialConsent } from './social-consent.model'

@Component({
	selector: 'app-testimonial-form',
	templateUrl: './testimonial-form.component.html',
	styleUrls: ['./testimonial-form.component.scss'],
	providers: [NewsService]
})
export class TestimonialFormComponent implements OnInit, OnDestroy {
	subscription: Subscription = new Subscription()

	TESTIMONIAL_PAGE_LINK: string = TESTIMONIAL_PAGE_LINK
	SINGLE_TESTIMONIAL_PAGE_LINK: string = SINGLE_TESTIMONIAL_PAGE_LINK
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL
	@ViewChild('testimonialModal') testimonialModal: ModalDirective

	testimonialFormGroup: UntypedFormGroup
	formBuilder: UntypedFormBuilder = new UntypedFormBuilder()

	@Input() title: string = ''
	initialTitle: string = ''
	text: string = ''
	initialText: string = ''
	excerpt: string = ''
	initialExcerpt: string = ''
	@Input() contributor: string = ''
	initialContributor: string = ''
	@Input() institution: string = ''
	initialInstitution: string = ''
	@Input() workgroup: string = ''
	initialWorkgroup: string = ''
	@Input() simple_vm: boolean = false
	@Input() project_application: Application
	@Input() testimonialSent: boolean
	initialLoadingSuccessful: boolean = false
	image_url: string = ''
	possibleSocialConsents: SocialConsent[] = []
	selectedSocialConsents: SocialConsent[] = []
	selectedSocialPhotoConsents: SocialConsent[] = []
	submissionSuccessful: boolean = false
	autosaveTimer: ReturnType<typeof setTimeout>
	autosaveTimeout: number = 60000
	userInteractedWithForm: boolean = false
	autoSaveInProgress: boolean = false
	showAutosaveSucess: boolean = false
	showAutosaveFail: boolean = false
	autosaveStatusTimer: ReturnType<typeof setTimeout>
	file: File = null
	hideTestimonialForm: boolean = false

	constructor(private newsService: NewsService) {}

	ngOnInit(): void {
		this.setInitialData()
		this.subscription = new Subscription()
		this.getTestimonialData()

		this.newsService.getPossibleSocialConsents().subscribe((consents: SocialConsent[]) => {
			this.possibleSocialConsents = consents
		})
	}

	createFormGroup(): void {
		this.testimonialFormGroup = this.formBuilder.group({
			testimonial_title: [this.title, Validators.compose([Validators.required, Validators.minLength(5)])],
			testimonial_text: [this.text, Validators.compose([Validators.required, Validators.minLength(1500)])],
			testimonial_excerpt: [
				this.excerpt,
				Validators.compose([Validators.required, Validators.minLength(200), Validators.maxLength(1000)])
			],
			testimonial_contributor: [this.contributor, Validators.required],
			testimonial_institution: [this.institution, Validators.required],
			testimonial_workgroup: [this.workgroup, Validators.required]
		})
		this.listenToChanges()
	}

	listenToChanges(): void {
		this.testimonialFormGroup.get('testimonial_title').valueChanges.subscribe((val: string): void => {
			this.title = val
		})
		this.testimonialFormGroup.get('testimonial_text').valueChanges.subscribe((val: string): void => {
			this.text = val
		})
		this.testimonialFormGroup.get('testimonial_excerpt').valueChanges.subscribe((val: string): void => {
			this.excerpt = val
		})
		this.testimonialFormGroup.get('testimonial_contributor').valueChanges.subscribe((val: string): void => {
			this.contributor = val
		})
		this.testimonialFormGroup.get('testimonial_institution').valueChanges.subscribe((val: string): void => {
			this.institution = val
		})
		this.testimonialFormGroup.get('testimonial_workgroup').valueChanges.subscribe((val: string): void => {
			this.workgroup = val
		})
		this.testimonialFormGroup.valueChanges.subscribe((): void => {
			this.checkAutosaveNeed()
		})
	}
	/**
	 * updateSelectedOptions does not work yet
	 * @param socialConsent the object that got checked/unchecked
	 */
	updateSelectedOptions(socialConsent: SocialConsent): void {
		const idx: number = this.selectedSocialConsents.findIndex(consent => consent.id === socialConsent.id)

		if (idx !== -1) {
			this.selectedSocialConsents.splice(idx, 1)
		} else {
			this.selectedSocialConsents.push(socialConsent)
		}
	}

	updateSelectedPhotoOptions(socialPhotoConsent: SocialConsent): void {
		const idx: number = this.selectedSocialPhotoConsents.findIndex(consent => consent.id === socialPhotoConsent.id)
		if (idx !== -1) {
			this.selectedSocialPhotoConsents.splice(idx, 1)
		} else {
			this.selectedSocialPhotoConsents.push(socialPhotoConsent)
		}
	}

	setInitialData(): void {
		this.initialTitle = this.title
		this.initialText = this.text
		this.initialExcerpt = this.excerpt
		this.initialContributor = this.contributor
		this.initialInstitution = this.institution
		this.initialWorkgroup = this.workgroup
	}

	checkAutosaveNeed(): void {
		const initial: string[] = [
			this.initialTitle,
			this.initialText,
			this.initialExcerpt,
			this.initialContributor,
			this.initialInstitution,
			this.initialWorkgroup
		]
		const current: string[] = [this.title, this.text, this.excerpt, this.contributor, this.institution, this.workgroup]
		let setInteractionValue: boolean = false
		for (let i: number = 0; i < initial.length; i += 1) {
			if (initial[i] !== current[i]) {
				setInteractionValue = true
				break
			}
		}
		this.userInteractedWithForm = setInteractionValue
		if (this.userInteractedWithForm) {
			this.setInitialData()
		}
		if (!this.autosaveTimer) {
			this.autosaveLoop()
		}
	}
	getTestimonialData(): void {
		if (
			this.project_application.project_application_testimonial_draft_id &&
			!this.project_application.project_application_testimonial_submitted
		) {
			this.subscription.add(
				this.newsService.getTestimonial(this.project_application.project_application_id.toString()).subscribe(
					(result: any): void => {
						this.adjustFormWithSavedData(result)
						this.createFormGroup()
						this.initialLoadingSuccessful = true
						if (!this.project_application.project_application_testimonial_submitted) {
							this.autosaveLoop()
						}
					},
					(error: any): void => {
						if (error.error['other_user']) {
							this.hideTestimonialForm = true
						} else {
							this.createFormGroup()
						}
					}
				)
			)
		} else {
			this.createFormGroup()
		}
	}

	adjustFormWithSavedData(result: any): void {
		this.title = result['title']
		this.text = result['testimonials_text']
		this.excerpt = result['excerpt']
		this.institution = result['institution']
		this.workgroup = result['workgroup']
		this.contributor = result['contributor']
		this.selectedSocialConsents = result['publication_channels']
		this.selectedSocialPhotoConsents = result['photo_publication_channels']
	}

	stopAutosaveTimer(): void {
		if (this.autosaveTimer) {
			clearTimeout(this.autosaveTimer)
		}
	}

	stopAutosaveStatusTimer(): void {
		if (this.autosaveStatusTimer) {
			clearTimeout(this.autosaveStatusTimer)
		}
	}

	startDisappearTimer(): void {
		this.autosaveStatusTimer = setTimeout((): void => {
			this.showAutosaveSucess = false
			this.showAutosaveFail = false
		}, 5000)
	}

	autosaveLoop(timeout: number = this.autosaveTimeout): void {
		this.stopAutosaveTimer()
		this.autosaveTimer = setTimeout((): void => {
			if (this.userInteractedWithForm) {
				this.autoSaveInProgress = true
				this.showAutosaveSucess = false
				this.stopAutosaveStatusTimer()
				this.subscription.add(
					this.newsService
						.autoSaveTestimonialDraft(
							this.title,
							this.text,
							this.excerpt,
							this.contributor,
							this.institution,
							this.workgroup,
							this.project_application.project_application_id.toString(),
							this.selectedSocialConsents,
							this.selectedSocialPhotoConsents
						)
						.subscribe(
							(): void => {
								this.autoSaveInProgress = false
								this.userInteractedWithForm = false
								this.showAutosaveSucess = true
								this.startDisappearTimer()
							},
							(error: any): void => {
								this.autoSaveInProgress = false
								this.userInteractedWithForm = false
								if (error.error['other_user']) {
									this.hideTestimonialForm = true
								} else {
									this.showAutosaveFail = true
									this.startDisappearTimer()
									this.stopAutosaveTimer()
								}
							}
						)
				)
			}
			this.autosaveLoop()
		}, timeout)
	}

	adjustFile(event): void {
		const accepted: string[] = ['image/png', 'image/jpeg']
		if (accepted.includes((event.target.files[0] as File).type)) {
			this.file = event.target.files[0]
		}
	}

	sendTestimonial(): void {
		this.testimonialSent = true
		this.subscription.add(
			this.newsService
				.sendTestimonialDraft(
					`${this.title} FINAL DRAFT`,
					this.text,
					this.excerpt,
					this.contributor,
					this.institution,
					this.workgroup,
					this.project_application.project_application_id.toString(),
					this.selectedSocialConsents,
					this.selectedSocialPhotoConsents,
					this.file
				)
				.subscribe((result: any): any => {
					this.submissionSuccessful = result['created']
					this.project_application.project_application_testimonial_submitted = true
					this.stopAutosaveTimer()
					this.testimonialModal.show()
				})
		)
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
	}
}
