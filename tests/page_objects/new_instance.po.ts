// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * New Instance Page.
 */
export class NewInstancePage {
	private PROJECT_SELECTION_DROPDOWN: string = 'project_selection_dropdown';
	private INSTANCE_NAME_INPUT_FIELD: string = 'instance_name_input_field';
	private FLAVOR_SELECTION_PREFIX: string = 'flavor_';
	private IMAGE_SELECTION_PREFIX: string = 'image_';
	private FLAVOR_IMAGE_SELECTED_SUFFIX: string = '_selected';
	private NORMAL_FLAVOR_TO_SELECT: string = 'de_NBI_tiny';
	private NORMAL_IMAGE_PREFIX_TO_SELECT: string = 'Ubuntu_20_04_LTS_de_NBI__';
	private ADD_NEW_VOLUME_TAB: string = 'add_new_volume_tab';
	private NEW_VOLUME_NAME_INPUT: string = 'new_volume_name_input';
	private NEW_VOLUME_MOUNT_PATH_INPUT: string = 'new_volume_mount_path_input';
	private NEW_VOLUME_STORAGE_INPUT: string = 'new_volume_storage_input';
	private NEW_VOLUME_CONFIRMATION_BUTTON: string = 'add_volume_confirmation_button';
	private VM_RESPONSIBILITY_CHECKBOX: string = 'vm_responsibility_input';
	private START_VM_BUTTON: string = 'start_vm_button';
	private RESENV_TEMPLATE_PREFIX: string = 'add_resenv_template_';
	private RESENV_URL_INPUT: string = 'resenv_url_input';
	private ANSIBLE_NEED_OKAY: string = 'ansible_need_okay';
	private RESENV_ACCORDION_HEADING: string = 'resenv_accordion_heading';
	private SITE_LOADER: string = 'site-loader';
	private REDIRECTING_INSTANCE_OVERVIEW = 'redirecting_instance_overview';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto New Instance Page');
		await this.page.goto(`${this.baseURL}/#/virtualmachines/newVM`, { waitUntil: 'networkidle' });
		console.log(this.page.url());
		expect(this.page.url()).toContain('/newVM');
		await this.page.locator('text=New Virtual Machine').waitFor();
	}

	async selectProject(application_name: string): Promise<any> {
		console.log('Selecting project');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden' });
		const dropdown = await this.page.locator(Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN)).isVisible();
		if (dropdown) {
			await this.page.selectOption(Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN), {
				label: application_name,
			});
			await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).isVisible();
		} else {
			await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).isVisible();
		}
		console.log('Project selected');
	}

	async startNormalVM(
		application_name: string,
		vm_name: string,
		with_volume: boolean = false,
		with_resenv: boolean = false,
		prebuild: boolean = false,
	): Promise<any> {
		console.log('Fill name');
		await this.page.fill(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD), vm_name);
		console.log('Choose flavor');
		await Util.clickByDataTestIdStr(this.page, this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT);
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await this.page
			.locator(
				Util.by_data_test_id_str(
					this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX,
				),
			)
			.isVisible();
		console.log('Flavor chosen');
		console.log('Choose image');
		if (prebuild) {
			// TODO: adjust to prebuild image for resenv
			await Util.clickByDataTestIdStrPrefix(this.page, this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_PREFIX_TO_SELECT);
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await this.page
				.locator(
					`${Util.by_data_test_id_str_prefix(
						this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_PREFIX_TO_SELECT,
					)}, ${Util.by_data_test_id_str_suffix(this.FLAVOR_IMAGE_SELECTED_SUFFIX)}`,
				)

				.isVisible();
			console.log('Image chosen');
		} else {
			await Util.clickByDataTestIdStrPrefix(this.page, this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_PREFIX_TO_SELECT);
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await this.page
				.locator(
					`${Util.by_data_test_id_str_prefix(
						this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_PREFIX_TO_SELECT,
					)}, ${Util.by_data_test_id_str_suffix(this.FLAVOR_IMAGE_SELECTED_SUFFIX)}`,
				)

				.isVisible();
			console.log('Image chosen');
		}

		if (with_volume) {
			console.log('Adding volume');
			await Util.clickByDataTestIdStr(this.page, this.ADD_NEW_VOLUME_TAB);
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_NAME_INPUT), `volume_${application_name}`);
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_MOUNT_PATH_INPUT), 'test');
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_STORAGE_INPUT), '1');
			await Util.clickByDataTestIdStr(this.page, this.NEW_VOLUME_CONFIRMATION_BUTTON);
			console.log('Volume added');
		}
		if (with_resenv) {
			if (prebuild) {
				// TODO: adjust resenv selction to prebuild image
				console.log('Adding resenv (prebuild)');
			} else {
				console.log('Adding resenv');
				await Util.clickByDataTestIdStr(this.page, this.RESENV_ACCORDION_HEADING);
				await Util.clickByDataTestIdStr(this.page, `${this.RESENV_TEMPLATE_PREFIX}${Util.RSTUDIO}`);
				await this.page.fill(Util.by_data_test_id_str(this.RESENV_URL_INPUT), Util.RESENV_URL);
				await Util.clickByDataTestIdStr(this.page, this.ANSIBLE_NEED_OKAY);
				console.log('Resenv added');
			}
		}
		await Util.clickByDataTestIdStr(this.page, this.VM_RESPONSIBILITY_CHECKBOX);
		await Util.clickByDataTestIdStr(this.page, this.START_VM_BUTTON);
		await this.page.waitForSelector(Util.by_data_test_id_str(this.REDIRECTING_INSTANCE_OVERVIEW), {
			state: 'visible',
		});
	}
}
