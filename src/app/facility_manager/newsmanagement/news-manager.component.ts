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
  allNews: DenbiNews[];
  wordPressNews: WordPressNews[];
  selectedNews: DenbiNews = new DenbiNews();
  selectedNewsForm: FormGroup = new FormGroup({
                                                title: new FormControl({value: this.selectedNews.title, disabled: false},
                                                                       Validators.required),
                                                text: new FormControl({value: this.selectedNews.text, disabled: false},
                                                                      Validators.required),
                                                motd: new FormControl({value: this.selectedNews.motd, disabled: false}),
                                                tag: new FormControl({value: this.selectedNews.tag, disabled: false})
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
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacilities = this.managerFacilities.map((facility: [string, number]) => facility);
      this.managerFacilitiesIdOnly = this.managerFacilities.map((facility: [string, number]) => facility['FacilityId']);
      this.list();
      this.setFormGroup();
    });
    this.selectedNews = new DenbiNews();
    const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]) => facility['FacilityId'].toString());
    this.newsService.getNewsFromWP(facility_ids.toString()).subscribe((result: any) => {
      if (result) {
        console.log(result);
        //Save news here next step!
      }
    });
  }

  controlToNews(): void {
    this.selectedNews.title = this.selectedNewsForm.controls['title'].value;
    this.selectedNews.text = this.selectedNewsForm.controls['text'].value;
    this.selectedNews.motd = this.selectedNewsForm.controls['motd'].value;
    this.selectedNews.tag = this.selectedNewsForm.controls['tag'].value;
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


  /**
   * Building the posibility to manage facility news in wordpress
   */
  getWordPressNews(): void {
    const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]) => facility['FacilityId'].toString());
    this.newsService.getNewsFromWP(facility_ids.toString()).subscribe((result: Object[]) => {
      result.forEach((wp_news: Object) =>  {
        let wp_temp: WordPressNews = new WordPressNews();
          wp_temp.id = wp_news["id"];
          wp_temp.title = wp_news["title"];
          wp_temp.date = wp_news["date"];
          wp_temp.modification_date = wp_news["modified"];
          wp_temp.text = wp_news["content"]["rendered"];
          wp_temp.excerpt = wp_news["excerpt"]["rendered"];
          wp_temp.tags = wp_news["tags"];
          wp_temp.facility = wp_news["categories"];
          wp_temp.status = wp_news["status"];
        this.wordPressNews.push(new WordPressNews(wp_temp))
      });
      console.log(this.wordPressNews);
    })
  }

  returnPlainText(htmlAsString: string): string {
    return htmlAsString ? String(htmlAsString).replace(/<[^>]+>/gm, '') : '';
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
    /*this.newsService.getNews(facility_ids.toString()).subscribe((result: any) => {
      this.allNews = result;
      this.allNews.forEach((news: DenbiNews) => {
        news.tag = news.tag.replace(this.reg1, '').replace(this.reg2, '').replace(this.reg3, '');
        this.isEditable(news);
      });
    });*/
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
  }

  setNews(news?: DenbiNews): void {
    this.facilitiesToPost = [];
    if (news) {
      this.selectedNews = new DenbiNews(news);
      for (const facility_id of this.managerFacilitiesIdOnly) {
        if (this.selectedNews.facility_id.indexOf(facility_id) !== -1) {
          this.facilitiesToPost.push(facility_id);
        }
      }
      if (this.selectedNews.motd) {
        this.motdLength.next(this.selectedNews.motd.length);
      } else {
        this.motdLength.next(0);
      }
    } else {
      this.selectedNews = new DenbiNews();
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
                                              {value: this.selectedNews.motd, disabled: false}),
                                            tag: new FormControl(
                                              {value: this.selectedNews.tag, disabled: false})
                                          });
    this.selectedNewsForm.controls['motd'].valueChanges.subscribe((value: any) => {
      this.motdLength.next(value.length);
    });
  }

  setFacility(facility: [string, number]): void {
    const index: number = this.facilitiesToPost.indexOf(facility['FacilityId']);
    if (index === -1) {
      this.facilitiesToPost.push(facility['FacilityId']);
      this.selectedNews.facility_id.push(facility['FacilityId'])
    } else {
      this.facilitiesToPost.splice(index, 1);
      this.selectedNews.facility_id.splice(this.selectedNews.facility_id.indexOf(facility['FacilityId']), 1);
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
}
