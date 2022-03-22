import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 *  Vo Overview Page.
 */
export class VoOverviewPage {
	private VO_OVERVIEW_URL: string = '/#/vo-manager/overview';
	private FILTER_PROJECT_NAME_INPUT: string = 'filter_project_name';
	private SHOW_TERMINATE_PREFIX: string = 'show_terminate_';
	private TERMINATE_PROJECT_BTN: string = 'approve_terminate_project_btn';
	private NOTIFICATION_MESSAGE: string = 'notification_message';
	private CLOSE_NOTIFICATION_BTN: string = 'close_notification_modal_btn';
	private PROJECT_TERMINATED_MESSAGE: string = 'The project was terminated.';
	private PROJECT_TERMINATION_FORWARDED_TO_FACILITY: string =		'The request to terminate the project was forwarded to the facility manager.';

	private TERMINATE_BUTTON_TEXT: string = 'Terminate Project';
	private NOTIFICATION_MODAL_TITLE: string = 'notification_modal_title';
	private SUCCESS: string = 'Success';
	private SITE_LOADER: string = 'site-loader';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto vo manager overview Page');
		await this.page.goto(this.baseURL + this.VO_OVERVIEW_URL, { waitUntil: 'networkidle' });
		console.log(this.page.url());

		expect(this.page.url()).toContain(this.VO_OVERVIEW_URL);
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden' });
	}

	async filterForProjects(filter: string): Promise<any> {
		console.log(`Filter for ${filter} Projects`);
		await this.page.type(Util.by_data_test_id_str(this.FILTER_PROJECT_NAME_INPUT), filter);
	}

	async terminateOpenStackProjects(project_name: string): Promise<any> {
		console.log(`Terminate all openstack projects with name ${project_name}`);
		await this.goto();
		await this.filterForProjects(project_name);

		const project_count: number = await this.page.locator('button >> text=Terminate Project').count();
		console.log(`Terminating ${project_count} openstack projects with name ${project_name}`);
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < project_count; i++) {
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator('button >> text=Terminate Project').first().click();
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.TERMINATE_PROJECT_BTN)).first().click();

			// eslint-disable-next-line no-await-in-loop
			await this.page.waitForSelector(
				`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.PROJECT_TERMINATION_FORWARDED_TO_FACILITY}`,
			);
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_BTN)).click();
		}
	}

	async terminateSimpleVMProjects(project_name: string): Promise<any> {
		console.log(`Terminate all simplevm projects with name ${project_name}`);
		await this.goto();
		await this.filterForProjects(project_name);

		const project_count: number = await this.page.locator('button >> text=Terminate Project').count();
		console.log(`Terminating ${project_count} simplevm projects with name ${project_name}`);
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < project_count; i++) {
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator('button >> text=Terminate Project').first().click();
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.TERMINATE_PROJECT_BTN)).first().click();

			// eslint-disable-next-line no-await-in-loop
			await this.page.waitForSelector(
				`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.PROJECT_TERMINATED_MESSAGE}`,
			);
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_BTN)).click();
		}
	}
}
