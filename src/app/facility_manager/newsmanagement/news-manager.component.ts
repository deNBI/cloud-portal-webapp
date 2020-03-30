import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../api-connector/news.service';
import {FacilityService} from '../../api-connector/facility.service';
import {DenbiNews} from './news';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {WordPressNews} from "./wp-news";

/**
 * News-Manager Class.
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
  computeCenters : any[] = [];
  allNews: DenbiNews[];
  wordPressNews: WordPressNews[];
  selectedNews: WordPressNews = new WordPressNews();
  newWordpressNews: WordPressNews = new WordPressNews();
  selectedNewsForm: FormGroup = new FormGroup({
                                                title: new FormControl({value: this.newWordpressNews.title, disabled: false},
                                                                       Validators.required),
                                                text: new FormControl({value: this.newWordpressNews.text, disabled: false},
                                                                      Validators.required),
                                                motd: new FormControl({value: this.newWordpressNews.excerpt, disabled: false}),
                                                tag: new FormControl({value: this.newWordpressNews.tags, disabled: false})
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

  ngOnInit(): void {
    this.facilityService.getComputeCenters().subscribe((computeCenters: any[]) => {
      this.computeCenters = computeCenters;
      this.facilityService.getManagerFacilities().subscribe((result: any) => {
        this.managerFacilities = result;
        this.selectedFacilities = this.managerFacilities.map((facility: [string, number]) => facility);
        this.managerFacilitiesIdOnly = this.managerFacilities.map((facility: [string, number]) => facility['FacilityId']);
        this.list();
        this.setFormGroup();
        this.getWordPressNews();
      });
    });
  }
  controlToNews(): void {
    this.selectedNews.title = this.selectedNewsForm.controls['title'].value;
    this.selectedNews.text = this.selectedNewsForm.controls['text'].value;
    this.selectedNews.excerpt = this.selectedNewsForm.controls['motd'].value;
    this.selectedNews.tags = this.selectedNewsForm.controls['tag'].value;
  }

  add(news: DenbiNews): void {
    this.controlToNews();
    this.newsService.addNews(news).subscribe(
      (result: any) => {
        if (result[0] === `The article: '${this.selectedNews.title}' was added.`) {
          this.addingStatus = 1;
        } else {
          this.addingStatus = 2;
          this.error_string = result[0];
        }
        this.list();
      },
      (error: any) => {
        this.addingStatus = 2;
        this.error_string = error[0];
      }
    );
  }

  addNewsToWordpress(news: WordPressNews): void {
    news.status = "publish";
    news.title = this.selectedNewsForm.controls["title"].value;
    news.text = this.selectedNewsForm.controls["text"].value;
    news.excerpt = this.selectedNewsForm.controls["motd"].value;
    news.tags = this.selectedNewsForm.controls["tag"].value;
    if (news.tags) {
      news.tags = news.tags.replace(/\s/g, "");
    }
    let tempArr: string[] = [];
      this.facilitiesToPost.forEach((facility: any) => {
        let computeCenter = this.computeCenters.find(i => i.compute_center_facility_id === facility);
        if (computeCenter) {
          let wp_id = computeCenter["compute_center_news_id"];
          if (wp_id) {
            tempArr.push(wp_id);
          }
        }
    });
      news.facility = tempArr.toString();
      this.newsService.addNewsToWordpress(news).subscribe((result: any )=> {
      console.log(result);
      this.getWordPressNews();
      });
  }


  /**
   * Building the posibility to manage facility news in wordpress
   */
  getWordPressNews(): void {
    this.wordPressNews = [];
    const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]) => facility['FacilityId'].toString());
    console.log(facility_ids.toString());
    this.newsService.getNewsFromWP(facility_ids.toString()).subscribe((result: Object[]) => {
      result.forEach((wp_news: Object) =>  {
        let wp_temp: WordPressNews = new WordPressNews();
          wp_temp.id = wp_news["id"];
          const rendered_title: string = wp_news["title"]["rendered"];
          wp_temp.title = rendered_title.replace(/(<([^>]+)>)/ig,"");
          wp_temp.date = wp_news["date"];
          wp_temp.modification_date = wp_news["modified"];
          const rendered_text: string = wp_news["content"]["rendered"];
          wp_temp.text = rendered_text.replace(/(<([^>]+)>)/ig,"");
          const rendered_excerpt: string = wp_news["excerpt"]["rendered"];
          wp_temp.excerpt = rendered_excerpt.replace(/(<([^>]+)>)/ig,"");
          wp_temp.tags = wp_news["tags"];
          wp_temp.facility = wp_news["categories"];
          wp_temp.status = wp_news["status"];
          this.wordPressNews.push(wp_temp);
      });
      console.log(this.wordPressNews);
    })
  }

  updateNewsInWordpress(): void {
    //update wordpress post by id
  }

  patch(news: DenbiNews): void {
    this.controlToNews();
    this.newsService.updateNews(news).subscribe(
      (result: any) => {
        if (result[0] === `The article: '${this.selectedNews.title}' was patched.`) {
          this.patchingStatus = 1;
        } else {
          this.patchingStatus = 2;
          this.error_string = result[0];
        }
        this.list();
      },
      (error: any) => {
        this.patchingStatus = 2;
        this.error_string = error[0];
      });
  }

  list(): void {
    if (this.selectedFacilities.length === 0) {
      this.allNews = [];

      return;
    }
    const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]) => facility['FacilityId'].toString());
  }

  delete(news: DenbiNews): void {
    this.deletionStatus = 0;
    this.error_string = '';
    this.newsService.deleteNews(news.id.toString())
      .subscribe(
        (result: any) => {
          if (result[0] === 'True') {
            this.deletionStatus = 1;
          } else {
            this.deletionStatus = 2;
            this.error_string = result;
          }
          this.list();
        },
        (error: any) => {
          this.deletionStatus = 2;
          this.error_string = error;
        })
  }

  selectAllFacilities(): void {
    if (this.selectedFacilities.length === this.managerFacilities.length) {
      this.selectedFacilities = [];
      this.allChecked = false;
    } else {
      this.selectedFacilities = this.managerFacilities.map((facility: [string, number]) => facility);
      this.allChecked = true;
      this.list();
    }
    this.getWordPressNews();
  }

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
    this.list();
    this.getWordPressNews();
  }

  setNews(news?: WordPressNews): void {
    this.facilitiesToPost = [];
    if (news) {
      this.selectedNews = news;
      for (const facility_id of this.managerFacilitiesIdOnly) {
        //need to check how to get facility numbers from database by wordpress facility
      }
      if (this.selectedNews.excerpt) {
        this.motdLength.next(this.selectedNews.excerpt.length);
      } else {
        this.motdLength.next(0);
      }

      const fac_ids: string[] = news.facility.toString().split(',');
      fac_ids.forEach((center: string) => {
        let centerToPost = this.computeCenters
          .find(i => i["compute_center_news_id"] === center);
        this.facilitiesToPost.push(centerToPost["compute_center_facility_id"]);
      });
      console.log(this.facilitiesToPost);
    } else {
      this.selectedNews = new WordPressNews();
      this.motdLength.next(0);
    }
    this.deletionStatus = 0;
    this.patchingStatus = 0;
    this.addingStatus = 0;
    this.error_string = '';
    this.setFormGroup();
  }

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

  setFacility(facility: [string, number]): void {
    const index: number = this.facilitiesToPost.indexOf(facility['FacilityId']);
    if (index === -1) {
      this.facilitiesToPost.push(facility['FacilityId']);
      //this.selectedNews.facility.push(facility['FacilityId'])
    } else {
      this.facilitiesToPost.splice(index, 1);
      //this.selectedNews.facility_id.splice(this.selectedNews.facility_id.indexOf(facility['FacilityId']), 1);
    }
  }

  isEditable(news: DenbiNews): boolean {
    let editable: boolean = true;
    news.facility_id.forEach((value: number) => {
      if (this.managerFacilitiesIdOnly.indexOf(value) === -1) {
        editable = false;

        return false;
      }
    });
    news.editable = editable;

    return editable;
  }

  deleteNewsFromWordpress(): void {
    this.newsService.deleteNewsFromWordpress(this.selectedNews.id).subscribe((result: any) => {
      console.log(result);
      this.getWordPressNews();
    })
  }
}
