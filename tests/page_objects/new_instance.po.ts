// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { Page, expect } from '@playwright/test';
import { Util } from '../util';

/**
 * New Instance Page.
 */
export class ProfilePage {
	private PROJECT_SELECTION_DROPDOWN: string = 'project_selection_dropdown';
	private PROJECT_SELECTION_PREFIX: string = 'project_option_';
	private INSTANCE_NAME_INPUT_FIELD: string = 'instance_name_input_field';
	private FLAVOR_SELECTION_PREFIX: string = 'flavor_';
	private IMAGE_SELECTION_PREFIX: string = 'image_';
	private FLAVOR_IMAGE_SELECTED_SUFFIX: string = '_selected';
	private NORMAL_FLAVOR_TO_SELECT: string = 'de.NBI tiny';
	private NORMAL_IMAGE_TO_SELECT: string = 'Ubuntu 18.04 LTS (2021-12-13)';
	private ADD_NEW_VOLUME_TAB: string = 'add_new_volume_tab';
	private NEW_VOLUME_NAME_INPUT: string = 'new_volume_name_input';
	private NEW_VOLUME_MOUNT_PATH_INPUT: string = 'new_volume_mount_path_input';
	private NEW_VOLUME_STORAGE_INPUT: string = 'new_volume_storage_input';
	private NEW_VOLUME_CONFIRMATION_BUTTON: string = 'add_volume_confirmation_button';
	private VM_RESPONSIBILITY_CHECKBOX: string = 'vm_responsibility_input';

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

	}

	async selectProject(application_name: string): Promise<any> {
		const dropdown = await this.page.locator(Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN)).isVisible();
		if (dropdown) {
			await this.page.selectOption(
				Util.by_data_test_id_str(this.PROJECT_SELECTION_DROPDOWN),
				Util.by_data_test_id_str(this.PROJECT_SELECTION_PREFIX + application_name),
			);
			await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).isVisible();
		} else {
			await this.page.locator(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD)).isVisible();
		}

	}

	async startNormalVM(application_name: string, with_volume: boolean = false): Promise<any> {
		await this.page.fill(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD), application_name);
		await this.page.click(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT));
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await this.page.locator(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX));
		await this.page.click(Util.by_data_test_id_str(this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT));
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await this.page.locator(Util.by_data_test_id_str(this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX));
		if (with_volume) {
			await this.page.click(Util.by_data_test_id_str(this.ADD_NEW_VOLUME_TAB));
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_NAME_INPUT), `volume_${application_name}`);
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_MOUNT_PATH_INPUT), 'test');
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_STORAGE_INPUT), '5');
			await this.page.click(Util.by_data_test_id_str(this.NEW_VOLUME_CONFIRMATION_BUTTON));
			await this.page.click(Util.by_data_test_id_str(this.VM_RESPONSIBILITY_CHECKBOX));
		}

	}



}
