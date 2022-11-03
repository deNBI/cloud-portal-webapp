import {
	Component, Input, OnChanges, OnDestroy, OnInit,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BiocondaService } from '../../api-connector/bioconda.service';
import { ResearchEnvironment } from '../virtualmachinemodels/res-env';
import { RandomNameGenerator } from '../../shared/randomNameGenerator';
import { WIKI_RESENV_LINK, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../links/links';
import { BlockedImageTagResenv } from '../../facility_manager/image-tag';

/**
 * ResEnv.
 */
@Component({
	selector: 'app-res-env',
	templateUrl: 'res-env.component.html',
	providers: [BiocondaService],
})
export class ResEnvComponent implements OnInit, OnChanges, OnDestroy {
	@Input() clientid: string;
	@Input() forc_url: string;
	@Input() onlyNamespace: boolean = false;
	@Input() imageName: string = '';
	@Input() selectedImageTags: string[] = [];
	@Input() blockedImageTagsResenv: BlockedImageTagResenv[];
	@Input() workshopMode: boolean = false;

	Object: Object = Object;

	templates_to_block: string[] = [];

	user_key_url: UntypedFormControl = new UntypedFormControl('', [
		Validators.required,
		Validators.pattern('[a-zA-Z]{3,20}'),
	]);

	selectedTemplate: ResearchEnvironment | undefined = undefined;

	templates: ResearchEnvironment[] = [];

	undefinedTemplate: ResearchEnvironment = new ResearchEnvironment();

	rng: RandomNameGenerator;

	WIKI_RESENV_LINK: string = WIKI_RESENV_LINK;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;

	create_only_backend: boolean = false;

	subscription: Subscription = new Subscription();

	constructor(private condaService: BiocondaService) {
		this.condaService = condaService;
	}

	setUserKeyUrl(url: string): void {
		if (this.needsName()) {
			this.user_key_url.setValue(url);
		}
	}

	getUserKeyUrl(): string {
		return this.user_key_url.value;
	}

	getCreateOnlyBackend(): boolean {
		return this.create_only_backend;
	}

	setSelectedTemplate(template: ResearchEnvironment): void {
		if (template === null) {
			this.selectedTemplate = this.undefinedTemplate;
			this.user_key_url.setValue('');
			this.create_only_backend = false;

			return;
		}
		this.selectedTemplate = template;
	}

	ngOnInit(): void {
		this.undefinedTemplate.template_name = 'undefined';
		this.templates_to_block = [];
		this.setSelectedTemplate(null);
		this.subscription.add(
			this.condaService.getForcTemplates(this.clientid).subscribe((templates: ResearchEnvironment[]): void => {
				this.templates = templates;
			}),
		);
		this.rng = new RandomNameGenerator();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	ngOnChanges(): void {
		this.checkBlocked();
	}

	isValid(): boolean {
		if (this.onlyNamespace) {
			if (this.workshopMode) {
				return true;
			} else {
				return this.user_key_url.errors === null;
			}
		} else if (this.selectedTemplate.template_name === 'undefined') {
			if (this.workshopMode) {
				return false;
			} else {
				return this.user_key_url.value.length === 0;
			}
		} else if (this.workshopMode) {
			return true;
		} else {
			return this.user_key_url.errors === null;
		}
	}

	needsName(): boolean {
		if (this.onlyNamespace || this.selectedTemplate.template_name !== 'undefined') {
			return this.user_key_url.errors !== null;
		}

		return false;
	}

	needsTemplate(): boolean {
		if (this.workshopMode && this.selectedTemplate.template_name === 'undefined') {
			return true;
		} else if (this.user_key_url.value.length !== 0 && !this.onlyNamespace) {
			return this.selectedTemplate.template_name === 'undefined';
		}

		return false;
	}

	okayNeeded(): boolean {
		return this.selectedTemplate.template_name !== 'undefined';
	}

	setOnlyNamespace(template): void {
		this.onlyNamespace = true;
		this.create_only_backend = true;
		this.setSelectedTemplate(template);
	}

	unsetOnlyNamespace(): void {
		this.onlyNamespace = false;
		this.user_key_url.setValue('');
		this.setSelectedTemplate(null);
	}

	generateRandomName(): void {
		this.user_key_url.setValue(this.rng.randomName());
	}

	checkBlocked(): void {
		if (this.selectedImageTags === null || this.selectedImageTags === undefined) {
			return;
		}
		for (const blockedTag of this.blockedImageTagsResenv) {
			if (this.selectedImageTags.indexOf(blockedTag.tag) !== -1) {
				this.templates_to_block = blockedTag.resenvs;

				return;
			}
		}
		this.templates_to_block = [];
	}

	resetData(): void {
		this.setSelectedTemplate(null);
		this.create_only_backend = false;
	}
}
