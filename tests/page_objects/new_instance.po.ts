// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { Page, expect } from '@playwright/test';
import { Util } from '../util';

/**
 * New Instance Page.
 */
export class NewInstancePage {
	private PROJECT_SELECTION_DROPDOWN: string = 'project_selection_dropdown';
	private PROJECT_SELECTION_PREFIX: string = 'project_option_';
	private INSTANCE_NAME_INPUT_FIELD: string = 'instance_name_input_field';
	private FLAVOR_SELECTION_PREFIX: string = 'flavor_';
	private IMAGE_SELECTION_PREFIX: string = 'image_';
	private FLAVOR_IMAGE_SELECTED_SUFFIX: string = '_selected';
	private NORMAL_FLAVOR_TO_SELECT: string = 'de_NBI_tiny';
	private NORMAL_IMAGE_TO_SELECT: string = 'Ubuntu_18_04_LTS__2021-12-13_';
	private ADD_NEW_VOLUME_TAB: string = 'add_new_volume_tab';
	private NEW_VOLUME_NAME_INPUT: string = 'new_volume_name_input';
	private NEW_VOLUME_MOUNT_PATH_INPUT: string = 'new_volume_mount_path_input';
	private NEW_VOLUME_STORAGE_INPUT: string = 'new_volume_storage_input';
	private NEW_VOLUME_CONFIRMATION_BUTTON: string = 'add_volume_confirmation_button';
	private VM_RESPONSIBILITY_CHECKBOX: string = 'vm_responsibility_input';
	private START_VM_BUTTON: string = 'start_vm_button';

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
		console.log('Selecting project');
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
		console.log('Project selected');

	}

	async startNormalVM(application_name: string, with_volume: boolean = false): Promise<any> {
		console.log('Fill name');
		await this.page.fill(Util.by_data_test_id_str(this.INSTANCE_NAME_INPUT_FIELD), `${application_name}normal`);
		console.log('Choose flavor');
		await this.page.click(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT));
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await this.page.locator(Util.by_data_test_id_str(this.FLAVOR_SELECTION_PREFIX + this.NORMAL_FLAVOR_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX)).isVisible();
		console.log('Flavor chosen');
		console.log('Choose image');
		await this.page.click(Util.by_data_test_id_str(this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT));
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await this.page.locator(Util.by_data_test_id_str(this.IMAGE_SELECTION_PREFIX + this.NORMAL_IMAGE_TO_SELECT + this.FLAVOR_IMAGE_SELECTED_SUFFIX)).isVisible();
		console.log('Image chosen');
		if (with_volume) {
			console.log('Adding volume');
			await this.page.click(Util.by_data_test_id_str(this.ADD_NEW_VOLUME_TAB));
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_NAME_INPUT), `volume_${application_name}`);
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_MOUNT_PATH_INPUT), 'test');
			await this.page.fill(Util.by_data_test_id_str(this.NEW_VOLUME_STORAGE_INPUT), '5');
			await this.page.click(Util.by_data_test_id_str(this.NEW_VOLUME_CONFIRMATION_BUTTON));
			console.log('Volume added');
		}
		await this.page.click(Util.by_data_test_id_str(this.VM_RESPONSIBILITY_CHECKBOX));
		await this.page.click(Util.by_data_test_id_str(this.START_VM_BUTTON));
	}



}
