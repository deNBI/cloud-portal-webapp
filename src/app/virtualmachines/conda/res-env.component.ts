import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BiocondaService} from '../../api-connector/bioconda.service';
import {ResearchEnvironment} from '../virtualmachinemodels/res-env';

/**
 * ResEnv.
 */
@Component({
             selector: 'app-res-env',
             templateUrl: 'res-env.component.html',
             providers: [BiocondaService]
           })
export class ResEnvComponent implements OnInit {

  @Input() clientid: string;
  @Input() onlyNamespace: boolean = false;

  user_key_url: FormControl = new FormControl('',
                                              [Validators.required, Validators.pattern('[a-zA-Z]*')]);

  selectedTemplate: ResearchEnvironment = null;

  templates: ResearchEnvironment[] = [];

  undefinedTemplate: ResearchEnvironment = new ResearchEnvironment();

  constructor(private condaService: BiocondaService) {
  }

  getUserKeyUrl(): string {
    return this.user_key_url.value;
  }

  setSelectedTemplate(template: ResearchEnvironment): void {
    if (template === null) {
      this.selectedTemplate = this.undefinedTemplate;

      return;
    }
    this.selectedTemplate = template;
  }

  ngOnInit(): void {
    this.undefinedTemplate.template_name = 'undefined';
    this.setSelectedTemplate(null);
    this.condaService.getForcTemplates(this.clientid).subscribe((templates: any) => {
      for (const dict of templates) {
        const resenv: ResearchEnvironment = new ResearchEnvironment();
        resenv.template_name = dict['name'];
        resenv.template_version = dict['version'];
        switch (resenv.template_name) {
          case 'rstudio':
            resenv.template_logo_url = `static/webapp/assets/img/RStudio-Logo-flat.svg`;
            resenv.template_description = 'RStudio is an integrated development environment (IDE) for R. ' +
              'It includes a console, syntax-highlighting editor that supports direct code execution, ' +
              'as well as tools for plotting, history, ' +
              'debugging and workspace management.';
            resenv.template_info_url = 'https://rstudio.com/products/rstudio/features/';
            resenv.template_title = 'RStudio';
            break;
          case 'theiaide':
            resenv.template_title = 'Theia';
            break;
          case 'guacamole':
            resenv.template_title = 'Guacamole';
            break;
          case 'jupyternotebook':
            resenv.template_title = 'Jupyter Notebook';
            break;
          default:
            resenv.template_title = resenv.template_name;
            break;
        }
        this.templates.push(resenv);
      }
    });
  }
}
