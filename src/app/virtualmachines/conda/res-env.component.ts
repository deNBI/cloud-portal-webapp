import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {GroupService} from '../../api-connector/group.service';

/**
 * ResEnv.
 */
@Component({
             selector: 'app-res-env',
             templateUrl: 'res-env.component.html',
             providers: [BiocondaService, GroupService]
           })
export class ResEnvComponent implements OnInit {


  playbooks: {[pl_name: string]: {
      [var_name: string]: string
    }} = {};

  @Input() clientid: string;

  templates: {[template_name: string]: string[]} = {};

  selected_template: string = 'undefined';
  selected_version: string = '';

  user_key_url: FormControl = new FormControl('',
                                              [Validators.required, Validators.pattern('[a-zA-Z]*')]);

  constructor(private condaService: BiocondaService, private groupService: GroupService) {
  }

  addNothing(): void {
    console.log(this.clientid);
    this.groupService.getClientForcUrl(this.clientid).subscribe((response: JSON) => {
      console.log(response);
    });
  }

  getUserKeyUrl(): string {
    return this.user_key_url.value;
  }

  ngOnInit(): void {
    this.condaService.getForcTemplates(this.clientid).subscribe((templates: any) => {
      for (const dict of templates) {
        if (this.templates[dict['name']] === undefined || this.templates[dict['name']].length === 0) {
          this.templates[dict['name']] = [];
          this.templates[dict['name']].push(dict['version']);
        } else {
          this.templates[dict['name']].push(dict['version']);
        }
      }
    });
  }
}
