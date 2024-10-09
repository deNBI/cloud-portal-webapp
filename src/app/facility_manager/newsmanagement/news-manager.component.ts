import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { NewsService } from '../../api-connector/news.service'
import { FacilityService } from '../../api-connector/facility.service'
import { environment } from '../../../environments/environment'
import { FacilityNews } from './facility-news'
import { WIKI_MOTD } from '../../../links/links'

/**
 * News-Manager Class to manage news in wordPress.
 */
@Component({
	selector: 'app-news-manager',
	templateUrl: 'news-manager.component.html',
	providers: [NewsService, FacilityService]
})
export class NewsManagerComponent implements OnInit, OnDestroy {
	title: string = 'News Management'
	public production: boolean = environment.production
	WIKI_MOTD: string = WIKI_MOTD
	public managerFacilities: [string, number][]
	public managerFacilitiesIdOnly: number[]
	public selectedFacilities: [string, number][] = []
	public facilityToSetMOTD: number
	public facilityMOTDPairs: { [key: number]: number } = {}
	facilityToPost: number
	returnState: number = -1
	motdChecked: boolean = false
	@ViewChild('infoModal', { static: true }) infoModal: ModalDirective

	computeCenters: any[] = []
	facilityNews: FacilityNews[] = []
	newFacilityNews: FacilityNews = new FacilityNews()
	selectedFacilityNews: FacilityNews = new FacilityNews()

	PREDEFINED_TAGS: string[] = ['downtime', 'openstack', 'simplevm', 'maintenance', 'update']
	today: Date = new Date()

	newsSetAsMOTD: string[] = []

	allChecked: boolean = true
	deletionStatus: number = 0
	patchingStatus: number = 0
	addingStatus: number = 0
	error_string: string = ''
	reg1: RegExp = /\[/g
	reg2: RegExp = /]/g
	reg3: RegExp = /'/g
	subscription: Subscription = new Subscription()

	constructor(
		private newsService: NewsService,
		private facilityService: FacilityService
	) {
		// constructor for NewsManager
	}

	/**
	 * Method on site initialization.
	 */
	ngOnInit(): void {
		this.subscription.add(
			this.facilityService.getComputeCenters().subscribe((computeCenters: any[]): void => {
				this.computeCenters = computeCenters
				this.subscription.add(
					this.facilityService.getManagerFacilities().subscribe((result: any): void => {
						this.managerFacilities = result
						this.selectedFacilities = this.managerFacilities.map(
							(facility: [string, number]): [string, number] => facility
						)
						this.managerFacilitiesIdOnly = this.managerFacilities.map(
							(facility: [string, number]): number => facility['FacilityId']
						)
						this.getNewsFromAPI()
						this.setCurrentNews(null)
					})
				)
			})
		)
	}

	setFacilityToSetMotd(event: any = null): void {
		if (event) {
			this.motdChecked = event?.target.checked
		}
		const facilit_checkbox: HTMLElement | null = document.getElementById(`news_select_${this.facilityToPost}_motd`)
		if (facilit_checkbox && facilit_checkbox['checked']) {
			this.facilityToSetMOTD = this.facilityToPost
		} else {
			this.facilityToSetMOTD = null
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}

	addNewsToAPI(bare_news: FacilityNews): void {
		const news: FacilityNews = bare_news
		news.title = this.selectedFacilityNews.title
		news.text = this.selectedFacilityNews.text
		news.motd = this.selectedFacilityNews.motd
		news.expire_at = this.selectedFacilityNews.expire_at
		news.facility = this.facilityToPost
		news.tags = this.selectedFacilityNews.tags
		if (document.getElementById(`news_select_${this.facilityToPost}_motd`)['checked']) {
			this.facilityToSetMOTD = this.facilityToPost
		} else {
			this.facilityToSetMOTD = null
		}

		this.subscription.add(
			this.newsService.addFacilityNews(news).subscribe(
				(result: any): void => {
					if (result) {
						if (result['id']) {
							if (this.facilityToSetMOTD !== null) {
								this.subscription.add(
									this.newsService.updateFacilityMOTD(result['id'], this.facilityToSetMOTD).subscribe(
										(): void => {},
										(error: any) => {
											console.log(error)
											if ('error' in error) {
												this.error_string = error['error']['error']
											}
										}
									)
								)
							}
							this.returnState = 2
							this.infoModal.show()
						}
					}
					this.getNewsFromAPI()
					this.setCurrentNews(null)
				},
				(error: any) => {
					console.log(error)
					this.returnState = -1
					this.infoModal.show()
					if ('error' in error) {
						this.error_string = error['error']['error']
					}
					this.getNewsFromAPI()
				}
			)
		)
	}

	updateNewsInAPI(bare_news: FacilityNews): void {
		const news: FacilityNews = bare_news
		news.title = this.selectedFacilityNews.title
		news.text = this.selectedFacilityNews.text
		news.motd = this.selectedFacilityNews.motd
		news.expire_at = this.selectedFacilityNews.expire_at
		news.facility = this.facilityToPost
		news.tags = this.selectedFacilityNews.tags
		if (document.getElementById(`news_select_${this.facilityToPost}_motd`)['checked']) {
			this.facilityToSetMOTD = this.facilityToPost
			news.is_current_motd = true
		} else {
			this.facilityToSetMOTD = null
			news.is_current_motd = false
		}
		this.subscription.add(
			this.newsService.updateFacilityNews(news).subscribe(
				(result: any): void => {
					if (result) {
						if (result['id']) {
							if (this.facilityToSetMOTD !== null) {
								this.subscription.add(
									this.newsService.updateFacilityMOTD(result['id'], this.facilityToSetMOTD).subscribe(
										(): void => {},
										(error: any) => {
											console.log(error)
											if ('error' in error) {
												this.error_string = error['error']['error']
											}
										}
									)
								)
							}

							this.returnState = 2
							this.infoModal.show()
						}
					}
					this.getNewsFromAPI()
				},
				(error: any) => {
					console.log(error)
					this.returnState = -1
					this.infoModal.show()
					if ('error' in error) {
						this.error_string = error['error']['error']
					}
					this.getNewsFromAPI()
				}
			)
		)
	}

	getFacilitiesFromWagtail(): void {
		this.facilityMOTDPairs = []
		this.subscription.add(
			this.newsService.getFacilitiesFromWagtail().subscribe((facilities: any[]): void => {
				for (const facility of facilities) {
					this.facilityMOTDPairs[facility['id']] = facility['motd']
				}
			})
		)
	}

	getNewsFromAPI(): void {
		this.facilityNews = []
		const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]): string =>
			facility['FacilityId'].toString()
		)
		this.subscription.add(
			this.newsService.getFacilityNews(facility_ids.toString()).subscribe((result: FacilityNews[]): any => {
				this.facilityNews = result
			})
		)
		this.getFacilitiesFromWagtail()
	}

	/**
	 * Selects or deselects all facilities when the checkbox gets clicked.
	 */
	selectAllFacilities(): void {
		if (this.selectedFacilities.length === this.managerFacilities.length) {
			this.selectedFacilities = []
			this.allChecked = false
		} else {
			this.selectedFacilities = this.managerFacilities.map((facility: [string, number]): [string, number] => facility)
			this.allChecked = true
		}
		this.getNewsFromAPI()
	}

	/**
	 * Adds or deletes a facility from the list of facilities for which the news shall be loaded and shown.
	 *
	 * @param facility the facility which gets added/deleted
	 */
	selectFacility(facility: [string, number]): void {
		const index: number = this.selectedFacilities.indexOf(facility)
		if (index === -1) {
			this.selectedFacilities.push(facility)
		} else {
			this.selectedFacilities.splice(index, 1)
		}
		if (this.selectedFacilities.length === 0) {
			this.setCurrentNews()
		}
		this.allChecked = this.selectedFacilities.length === this.managerFacilities.length
		this.getNewsFromAPI()
	}

	setCurrentNews(news?: FacilityNews): void {
		this.facilityToPost = null
		this.facilityToSetMOTD = null
		console.log(news)
		if (news) {
			this.selectedFacilityNews = new FacilityNews(news)
			this.facilityToPost = news.facility
		} else {
			this.selectedFacilityNews = new FacilityNews()
			this.selectedFacilityNews.id = null
		}
		if (this.selectedFacilityNews.is_current_motd) {
			this.motdChecked = true
		} else {
			this.motdChecked = false
		}
		this.setFacilityToSetMotd()
	}

	/**
	 * Returns all public names of the facilities for which the news got posted as a concatenated string.
	 * The names are separated with commas.
	 *
	 * @param news the news for which the string shall be returned
	 */
	facilitiesAsString(news: FacilityNews): string {
		const newsId: string = news.id.toString()
		if (this.newsSetAsMOTD.includes(newsId)) {
			let facilitiesString: string = ''
			this.computeCenters.forEach((facility: any): void => {
				if (newsId.localeCompare(facility['compute_center_motd_id']) === 0) {
					const temp_string: string = `${facility['compute_center_name']}, `
					facilitiesString += temp_string
				}
			})

			return facilitiesString.substring(0, facilitiesString.length - 2)
		} else {
			return ''
		}
	}

	/**
	 * Checks if a news-object is set as a Message Of The Day in any facility.
	 *
	 * @param news the news which get's checked
	 */
	listNewsSetAsMOTD(): void {
		this.newsSetAsMOTD = []
		this.computeCenters.forEach((facility: any): void => {
			const motd_string: string = facility['compute_center_motd_id']
			if (!this.newsSetAsMOTD.includes(motd_string)) {
				if (motd_string !== '-1') {
					this.newsSetAsMOTD.push(motd_string)
				}
			}
		})
	}

	/**
	 * Adds or deletes a facility from the list of facilities to which the news shall be uploaded/updated.
	 *
	 * @param facility the facility which gets added/deleted
	 */
	setFacility(facility: [string, number]): void {
		this.facilityToPost = facility['FacilityId']
	}

	deleteNewsFromAPI(): void {
		this.subscription.add(
			this.newsService.deleteNewsFromAPI(this.selectedFacilityNews.id).subscribe(
				(): void => {
					this.returnState = 0
					this.infoModal.show()
					this.getNewsFromAPI()
				},
				(error: any) => {
					console.log(error)
					this.returnState = -1
					this.infoModal.show()
					if ('error' in error) {
						this.error_string = error['error']['error']
					}
					this.getNewsFromAPI()
				}
			)
		)
	}
}
