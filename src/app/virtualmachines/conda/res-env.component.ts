import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BiocondaService} from '../../api-connector/bioconda.service';

/**
 * ResEnv.
 */
@Component({
             selector: 'app-res-env',
             templateUrl: 'res-env.component.html',
             providers: [BiocondaService]
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

  constructor(private condaService: BiocondaService) {
  }

  addPlaybook(name: string): void {
    this.playbooks = {};
    this.playbooks[name] = {template_version: '2'};
  }

  addNothing(): void {
    console.log(this.user_key_url.errors);
  }

  getPlaybooks(): {[pl_name: string]: {
      [var_name: string]: string
    }} {
    return this.playbooks;
  }

  hasPlaybook(): boolean {
    return Object.keys(this.playbooks).length > 0;
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
