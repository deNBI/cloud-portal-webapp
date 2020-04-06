import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../api-connector/news.service';
import {FacilityService} from '../../api-connector/facility.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {WordPressNews} from "./wp-news";
import {WordPressTag} from "./wp-tags";

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
  facilitiesToSetMOTD: [string, number][] = [];
  selectedTags: string[] = [];
  computeCenters : any[] = [];
  availableTags: WordPressTag[] = [];
  wordPressNews: WordPressNews[];
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

  manageMOTD(facility: [string, number]): void {
    let index: number = this.facilitiesToSetMOTD.indexOf(facility);
    if (index > -1) {
      this.facilitiesToSetMOTD.splice(index, 1);
    } else {
      this.facilitiesToSetMOTD.push(facility);
    }
    console.log(this.facilitiesToSetMOTD);
  }

  getTagsAvailable(): void {
    this.newsService.getAvailableTagsFromWordPress().subscribe((result: any[]) => {
      if (result) {
        result.forEach((tag: any) => {
          let dict: any = {"name": tag["name"], "id": tag["id"]}
          let wordPressTag = new WordPressTag(dict);
          this.availableTags.push(wordPressTag);
        });
        console.log(this.availableTags);
      }
    })
  }

  addNewsToWordpress(news: WordPressNews, update: boolean): void {
    news.status = "publish";
    news.title = this.selectedNewsForm.controls["title"].value;
    news.text = this.selectedNewsForm.controls["text"].value;
    news.excerpt = this.selectedNewsForm.controls["motd"].value;
    if (this.selectedTags.length > 0) {
      news.tags = this.selectedTags.toString();
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
    if (update) {
      news.id = this.selectedNews.id;
      this.newsService.updateNewsInWordpress(news).subscribe((result: any) => {
        if (result) {
          if (result["id"]){
            this.setMOTDForFacility(result["id"].toString());
          }
        }
        this.getWordPressNews();
      });
    }
    else {
      this.newsService.addNewsToWordpress(news).subscribe((result: any) => {
        if (result) {
          if (result["id"]){
            this.setMOTDForFacility(result["id"].toString());
          }
        }
        this.getWordPressNews();
      });
    }

  }

  setMOTDForFacility(id: string): void {
    this.managerFacilities.forEach((element: [string, number]) =>  {
      let tempCenter = this.computeCenters
        .find(center => center["compute_center_facility_id"] == element["FacilityId"]);
      if (tempCenter){
        if (tempCenter["compute_center_motd_id"] == id) {
          this.facilityService.setMOTDForFacility(element["FacilityId"], "-1");
        }
      }
    });
    this.facilitiesToSetMOTD.forEach((element: [string, number]) => {
      this.facilityService.setMOTDForFacility(element["FacilityId"], id)});
  }


  /**
   * Building the posibility to manage facility news in wordpress
   */
  getWordPressNews(): void {
    this.wordPressNews = [];
    const facility_ids: string[] = this.selectedFacilities.map((facility: [string, number]) => facility['FacilityId'].toString());
    this.newsService.getNewsFromWordPress(facility_ids.toString()).subscribe((result: Object[]) => {
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
    })
  }


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

  setNews(news?: WordPressNews): void {
    this.facilitiesToPost = [];
    this.facilitiesToSetMOTD = [];
    if (news) {
      this.selectedNews = news;
      for (const facility_id of this.managerFacilitiesIdOnly) {
        //need this?
      }
      if (this.selectedNews.excerpt) {
        this.motdLength.next(this.selectedNews.excerpt.length);
      } else {
        this.motdLength.next(0);
      }
      this.managerFacilities.forEach((facility: [string, number]) => {
        let tempFacility: any = this.computeCenters.find(
          element => element["compute_center_facility_id"] == facility["FacilityId"]);
        if (tempFacility) {
          if (tempFacility["compute_center_motd_id"] == news.id) {
            this.facilitiesToSetMOTD.push(facility);
            console.log(news.id);
            document.getElementById("news_select_"+ facility['FacilityId'] +"_motd")["checked"] = true;
          }
        }
      });

      const fac_ids: string[] = news.facility.toString().split(',');
      fac_ids.forEach((center: string) => {
        let centerToPost = this.computeCenters
          .find(i => i["compute_center_news_id"] === center);
        this.facilitiesToPost.push(centerToPost["compute_center_facility_id"]);
      });
      this.selectedTags = [];
      const tag_ids: string[] = news.tags.toString().split(',');
      tag_ids.forEach((tag: string) => {
        this.selectedTags.push(tag);
      });
    } else {
      this.selectedNews = new WordPressNews();
      this.motdLength.next(0);
      this.selectedTags.forEach((tag: string) => {
        document.getElementById("checkbox_" + tag)["checked"] = false;
      })
      this.selectedTags = [];
      this.facilitiesToPost = [];
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
    } else {
      this.facilitiesToPost.splice(index, 1);
    }
  }

  manageTags(tag: WordPressTag): void {
    let index: number = this.selectedTags.indexOf(tag.id.toString());
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag.id.toString());
    }
    console.log(this.selectedTags);
  }



  deleteNewsFromWordpress(): void {
    this.newsService.deleteNewsFromWordpress(this.selectedNews.id).subscribe((result: any) => {
      this.getWordPressNews();
      this.setNews();
    })
  }
}
