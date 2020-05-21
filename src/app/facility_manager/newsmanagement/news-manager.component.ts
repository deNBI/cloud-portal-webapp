import {Component, OnInit, ViewChild} from '@angular/core';
import {NewsService} from '../../api-connector/news.service';
import {FacilityService} from '../../api-connector/facility.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {WordPressNews} from './wp-news';
import {WordPressTag} from './wp-tags';
import {ModalDirective} from 'ngx-bootstrap/modal';

/**
 * News-Manager Class to manage news in wordPress.
 */
@Component({
             selector: 'app-news-manager',
             templateUrl: 'news-manager.component.html',
             providers: [NewsService, FacilityService]
           })
export class NewsManagerComponent implements OnInit {

  title: string = 'News Management';
  public production: boolean = environment.production;

  public managerFacilities: [string, number][];
  public managerFacilitiesIdOnly: number[];
  public selectedFacilities: [string, number][] = [];
  public facilitiesToPost: number[] = [];
  returnState: number = -1;
  @ViewChild('infoModal', { static: true }) infoModal: ModalDirective;
  facilitiesToSetMOTD: [string, number][] = [];
  selectedTags: string[] = [];
  computeCenters: any[] = [];
  availableTags: WordPressTag[] = [];
  wordPressNews: WordPressNews[];
  newsSetAsMOTD: string[] = [];
  selectedNews: WordPressNews = new WordPressNews();
  newWordpressNews: WordPressNews = new WordPressNews();
  selectedNewsForm: FormGroup = new FormGroup({
                                                title: new FormControl({value: this.newWordpressNews.title, disabled: false},
                                                                       Validators.required),
                                                text: new FormControl({value: this.newWordpressNews.text, disabled: false},
                                                                      Validators.required),
                                                motd: new FormControl({value: this.newWordpressNews.excerpt, disabled: false})
                                              });
  allChecked: boolean = true;
  deletionStatus: number = 0;
  patchingStatus: number = 0;
  addingStatus: number = 0;
  error_string: string = '';
  reg1: RegExp = /\[/g;
  reg2: RegExp = /]/g;
  reg3: RegExp = /'/g;

  public motdLength: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private newsService: NewsService,
              private facilityService: FacilityService) {
  }

  /**
   * Method on site initialization.
   */
  ngOnInit(): void {
    this.facilityService.getComputeCenters().subscribe((computeCenters: any[]) => {
      this.computeCenters = computeCenters;
      this.facilityService.getManagerFacilities().subscribe((result: any) => {
        this.managerFacilities = result;
        this.selectedFacilities = this.managerFacilities.map((facility: [string, number]) => facility);
        this.managerFacilitiesIdOnly = this.managerFacilities.map((facility: [string, number]) => facility['FacilityId']);
        this.setFormGroup();
        this.getWordPressNews();
        this.getTagsAvailable();
      });
    });
  }

  /**
   * Manages the list which contains the facilities that will get the current News id set as the MOTD id.
   * @param facility the facility of the checkbox that got clicked
   */
  manageMOTD(facility: [string, number]): void {
    const index: number = this.facilitiesToSetMOTD.indexOf(facility);
    if (index > -1) {
      this.facilitiesToSetMOTD.splice(index, 1);
    } else {
      this.facilitiesToSetMOTD.push(facility);
    }
  }

  /**
   * Gets all available tags from WordPress for facility news.
   */
  getTagsAvailable(): void {
    this.newsService.getAvailableTagsFromWordPress().subscribe((result: any[]) => {
      if (result) {
        this.availableTags = result.map((tag: any) =>
          (new WordPressTag({name: tag['name'], id: tag['id']} as WordPressTag)));
      }
    });
  }

  /**
   * Adds or updates news in WordPress
   * @param news the news with all necessary attributes
   * @param update decides whether the news get updated or not
   */
  addNewsToWordpress(news: WordPressNews, update: boolean): void {
    news.status = 'publish';
    news.title = this.selectedNewsForm.controls['title'].value;
    news.text = this.selectedNewsForm.controls['text'].value;
    news.excerpt = this.selectedNewsForm.controls['motd'].value;
    if (this.selectedTags.length > 0) {
      news.tags = this.selectedTags.toString();
    }
    const tempArr: string[] = [];
    this.facilitiesToPost.forEach((facility: any) => {
      const computeCenter: any = this.computeCenters
        .find((center: any) => center.compute_center_facility_id === facility);
      if (computeCenter) {
        const wordPressComputeCenterId: string = computeCenter['compute_center_news_id'];
        if (wordPressComputeCenterId) {
          tempArr.push(wordPressComputeCenterId);
        }
      }
    });
    news.facility = tempArr.toString();
    if (update) {
      news.id = this.selectedNews.id;
      this.newsService.updateNewsInWordpress(news).subscribe((result: any) => {
        if (result) {
          if (result['id']) {
            this.returnState = 1;
            this.setMOTDForFacility(result['id'].toString());
            this.infoModal.show();
          }
        }
        this.getWordPressNews();
      });
    } else {
      this.newsService.addNewsToWordpress(news).subscribe((result: any) => {
        if (result) {
          if (result['id']) {
            this.returnState = 2;
            this.setMOTDForFacility(result['id'].toString());
            this.infoModal.show();
          }
        }
        this.getWordPressNews();
      });
    }
  }

  /**
   * Sets and replaces or deletes the MOTD for all facilities affected from the news or its update.
   * @param id the id of the news in WordPress to reference it
   */
  setMOTDForFacility(id: string): void {
    this.managerFacilities.forEach((element: [string, number]) => {
      const tempCenter: any = this.computeCenters
        .find((center: any) => center['compute_center_facility_id'] === element['FacilityId']);
      if (tempCenter) {
        if (tempCenter['compute_center_motd_id'] === id) {
          const facilityToCheck: [string, number] = this.facilitiesToSetMOTD
            .find((facility: [string, number]) =>
              facility['FacilityId'] === tempCenter['compute_center_facility_id']);
          if (!facilityToCheck) {
            this.facilityService.setMOTDForFacility(element['FacilityId'], '-1')
              .subscribe((result: any) => {
                this.facilityService.getComputeCenters().subscribe((computeCenters: any[]) => {
                  this.computeCenters = computeCenters; });
              });
          }
        } else {
          const facilityToCheck: [string, number] = this.facilitiesToSetMOTD
            .find((facility: [string, number]) =>
            facility['FacilityId'] === tempCenter['compute_center_facility_id']);
          if (facilityToCheck) {
            this.facilityService.setMOTDForFacility(element['FacilityId'], id)
              .subscribe((result: any) => {
                this.facilityService.getComputeCenters().subscribe((computeCenters: any[]) => {
                  this.computeCenters = computeCenters; });
              });
          }
        }
      }
    });
  }

  /**
   * Gets all available news for the facilities of the facility manager from WordPress.
   */
  getWordPressNews(): void {
    this.wordPressNews = [];
    const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]) => facility['FacilityId'].toString());
    this.newsService.getNewsFromWordPress(facility_ids.toString()).subscribe((result: Object[]) => {
      this.wordPressNews = result.map((news: Object) => this.createWordPressNews(news));
      this.setNews();
    });

  }

  /**
   * Method to create news to save it in the list of existing news.
   * @param wordPressNews the response as an Object from WordPress
   */
  createWordPressNews(wordPressNews: Object): WordPressNews {
    const news: WordPressNews = new WordPressNews();
    news.id = wordPressNews['id'];
    const rendered_title: string = wordPressNews['title']['rendered'];
    news.title = rendered_title.replace(/(<([^>]+)>)/ig, '');
    news.date = wordPressNews['date'];
    news.modification_date = wordPressNews['modified'];
    const rendered_text: string = wordPressNews['content']['rendered'];
    news.text = rendered_text.replace(/(<([^>]+)>)/ig, '');
    const rendered_excerpt: string = wordPressNews['excerpt']['rendered'];
    news.excerpt = rendered_excerpt.replace(/(<([^>]+)>)/ig, '');
    news.tags = wordPressNews['tags'];
    news.facility = wordPressNews['categories'];
    news.status = wordPressNews['status'];

    return news;
  }

  /**
   * Selects or deselects all facilities when the checkbox gets clicked.
   */
  selectAllFacilities(): void {
    if (this.selectedFacilities.length === this.managerFacilities.length) {
      this.selectedFacilities = [];
      this.allChecked = false;
    } else {
      this.selectedFacilities = this.managerFacilities.map((facility: [string, number]) => facility);
      this.allChecked = true;
    }
    this.getWordPressNews();
  }

  /**
   * Adds or deletes a facility from the list of facilities for which the news shall be loaded and shown.
   * @param facility the facility which gets added/deleted
   */
  selectFacility(facility: [string, number]): void {
    const index: number = this.selectedFacilities.indexOf(facility);
    if (index === -1) {
      this.selectedFacilities.push(facility);
    } else {
      this.selectedFacilities.splice(index, 1);
    }
    if (this.selectedFacilities.length === 0) {
      this.setNews();
    }
    this.selectedFacilities.length === this.managerFacilities.length ? this.allChecked = true : this.allChecked = false;
    this.getWordPressNews();
  }

  /**
   * Sets the news which got selected or creates a new news object. Also empties all relevant lists.
   * @param news the news which got clicked or null in all other cases
   */
  setNews(news?: WordPressNews): void {
    this.facilitiesToPost = [];
    this.facilitiesToSetMOTD = [];
    this.selectedTags = [];
    if (news) {
      this.selectedNews = news;
      if (this.selectedNews.excerpt) {
        this.motdLength.next(this.selectedNews.excerpt.length);
      } else {
        this.motdLength.next(0);
      }
      this.managerFacilities.forEach((facility: [string, number]) => {
        const tempFacility: any = this.computeCenters.find(
          (element: any) => element['compute_center_facility_id'] === facility['FacilityId']);
        if (tempFacility) {
          if (tempFacility['compute_center_motd_id'] === news.id.toString()) {
            this.facilitiesToSetMOTD.push(facility);
            document.getElementById(`news_select_${facility['FacilityId']}_motd`)['checked'] = true;
          } else {
            document.getElementById(`news_select_${facility['FacilityId']}_motd`)['checked'] = false;
          }
        } else {
        }
      });

      const facilityIds: string[] = news.facility.toString().split(',');
      this.facilitiesToPost = facilityIds.map((id: string) => this.computeCenters
        .find((facility: any) => facility['compute_center_news_id'] === id)['compute_center_facility_id']);
      const tagIds: string[] = news.tags.toString().split(',');
      this.selectedTags = tagIds.map((tag: string) => tag);
    } else {
      this.selectedNews = new WordPressNews();
      this.motdLength.next(0);

      this.managerFacilities.forEach((facility: [string, number]) => {
        if (document.getElementById(`news_select_${facility['FacilityId']}_motd`)) {
          document.getElementById(`news_select_${facility['FacilityId']}_motd`)['checked'] = false;
        }
      });
      this.selectedTags = [];
      this.facilitiesToPost = [];
    }
    this.deletionStatus = 0;
    this.patchingStatus = 0;
    this.addingStatus = 0;
    this.error_string = '';
    this.setFormGroup();
    this.listNewsSetAsMOTD();
  }

  /**
   * Returns all public names of the facilities for which the news got posted as a concatenated string.
   * The names are separated with commas.
   * @param news the news for which the string shall be returned
   */
  facilitiesAsString(news: WordPressNews): string {
    const newsId: string = news.id.toString();
    if (this.newsSetAsMOTD.includes(newsId)) {
      let facilitiesString: string = '';
      this.computeCenters.forEach((facility: any) => {
        if (newsId.localeCompare(facility['compute_center_motd_id']) === 0) {
          const temp_string: string = `${facility['compute_center_name']}, `;
          facilitiesString = facilitiesString + temp_string;
        }
      });

      return facilitiesString.substring(0, facilitiesString.length - 2);
    } else {
      return '';
    }
  }

  /**
   * Checks if a news-object is set as a Message Of The Day in any facility.
   * @param news the news which get's checked
   */
  listNewsSetAsMOTD(): void {
    this.newsSetAsMOTD = [];
    this.computeCenters.forEach((facility: any) => {
      const motd_string: string = facility['compute_center_motd_id'];
      if (!this.newsSetAsMOTD.includes(motd_string)) {
        if (motd_string !== '-1') {
          this.newsSetAsMOTD.push(motd_string);
        }
      }
    });
  }

  /**
   * Builds reference between news-values and form-fields.
   */
  setFormGroup(): void {
    this.selectedNewsForm = new FormGroup({
                                            title: new FormControl(
                                              {value: this.selectedNews.title, disabled: false}, Validators.required),
                                            text: new FormControl(
                                              {value: this.selectedNews.text, disabled: false}, Validators.required),
                                            motd: new FormControl(
                                              {value: this.selectedNews.excerpt, disabled: false}),
                                            tag: new FormControl(
                                              {value: this.selectedNews.tags, disabled: false})
                                          });
    this.selectedNewsForm.controls['motd'].valueChanges.subscribe((value: any) => {
      this.motdLength.next(value.length);
    });
  }

  /**
   * Adds or deletes a facility from the list of facilities to which the news shall be uploaded/updated.
   * @param facility the facility which gets added/deleted
   */
  setFacility(facility: [string, number]): void {
    const index: number = this.facilitiesToPost.indexOf(facility['FacilityId']);
    if (index === -1) {
      this.facilitiesToPost.push(facility['FacilityId']);
    } else {
      this.facilitiesToPost.splice(index, 1);
      if (this.facilitiesToSetMOTD.find((element: [string, number]) => element === facility)) {
        this.manageMOTD(facility);
        document.getElementById(`news_select_${facility['FacilityId']}_motd`)['checked'] = false;
      }
    }
  }

  /**
   * Adds or deletes tags from the list of tags to add to the news when the corresponding checkbox gets clicked.
   * @param tag the tag which gets added/deleted.
   */
  manageTags(tag: WordPressTag): void {
    const index: number = this.selectedTags.indexOf(tag.id.toString());
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag.id.toString());
    }
  }

  /**
   * Removes the selected news object from WordPress.
   */
  deleteNewsFromWordpress(): void {
    this.newsService.deleteNewsFromWordpress(this.selectedNews.id).subscribe((result: any) => {
      this.returnState = 0;
      this.infoModal.show();
      this.getWordPressNews();
    })
  }
}
