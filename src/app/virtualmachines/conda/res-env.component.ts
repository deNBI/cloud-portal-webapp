import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {ResearchEnvironment} from '../virtualmachinemodels/res-env';
import {RandomNameGenerator} from '../../shared/randomNameGenerator';
import {WIKI_RESENV_LINK} from '../../../links/links';
import {BlockedImageTagResenv} from '../../facility_manager/image-tag';

/**
 * ResEnv.
 */
@Component({
             selector: 'app-res-env',
             templateUrl: 'res-env.component.html',
             providers: [BiocondaService]
           })
export class ResEnvComponent implements OnInit, OnChanges {

  @Input() clientid: string;
  @Input() forc_url: string;
  @Input() onlyNamespace: boolean = false;
  @Input() imageName: string = '';
  @Input() selectedImageTags: string[] = [];
  @Input() blockedImageTagsResenv: BlockedImageTagResenv[];

  templates_to_block: string[] = [];

  user_key_url: FormControl = new FormControl('',
                                              [Validators.required, Validators.pattern('[a-zA-Z]*')]);

  selectedTemplate: ResearchEnvironment = null;

  templates: ResearchEnvironment[] = [];

  undefinedTemplate: ResearchEnvironment = new ResearchEnvironment();

  rng: RandomNameGenerator;

  WIKI_RESENV_LINK: string = WIKI_RESENV_LINK;

  constructor(private condaService: BiocondaService) {
  }

  getUserKeyUrl(): string {
    return this.user_key_url.value;
  }

  setSelectedTemplate(template: ResearchEnvironment): void {
    if (template === null) {
      this.selectedTemplate = this.undefinedTemplate;
      this.user_key_url.setValue('');

      return;
    }
    this.selectedTemplate = template;
  }

  ngOnInit(): void {
    this.undefinedTemplate.template_name = 'undefined';
    this.templates_to_block = [];
    this.setSelectedTemplate(null);
    this.condaService.getForcTemplates(this.clientid).subscribe((templates: ResearchEnvironment[]) => {
      this.templates = templates;
    });
    this.rng = new RandomNameGenerator();
  }

  ngOnChanges(): void {
    this.checkBlocked();
  }

  isValid(): boolean {
    if (this.onlyNamespace) {

      return this.user_key_url.errors === null;
    } else {
      if (this.selectedTemplate.template_name === 'undefined') {

        return this.user_key_url.value.length === 0;
      } else {

        return this.user_key_url.errors === null;
      }
    }
  }

  needsName(): boolean {
    if (this.onlyNamespace || this.selectedTemplate.template_name !== 'undefined') {
      return this.user_key_url.errors !== null;
    }
  }

  needsTemplate(): boolean {
    if (this.user_key_url.value.length !== 0 && !this.onlyNamespace) {
      return this.selectedTemplate.template_name === 'undefined';
    }
  }

  okayNeeded(): boolean {
    return (!this.onlyNamespace && this.selectedTemplate.template_name !== 'undefined');
  }

  setOnlyNamespace(): void {
    this.onlyNamespace = true;
    this.setSelectedTemplate(null);
  }

  unsetOnlyNamespace(): void {
    this.onlyNamespace = false;
    this.user_key_url.setValue('');
  }

  generateRandomName(): void {
    this.user_key_url.setValue(this.rng.randomName())
  }

  checkBlocked(): void {
    if (this.selectedImageTags === null || this.selectedImageTags === undefined) {
      return;
    }
    for (const blockedTag of this.blockedImageTagsResenv) {
      if (this.selectedImageTags.indexOf(blockedTag.tag) !== -1) {
        this.templates_to_block = blockedTag.resenvs;
      }
    }
  }

}
