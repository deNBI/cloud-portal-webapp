// tslint:disable-next-line:no-require-imports no-var-requires typedef
// const clc = require('cli-color');
// tslint:disable-next-line:no-require-imports no-var-requires typedef

import {Page} from '@playwright/test';

/**
 * Util test class.
 */
export class Util {
		// SIMPLEVM VARIABLES
		private static _SIMPLE_VM_APPLICATION_NAME_NO_PI: string = 'PTSimpleVMNoPi';
		private static _SIMPLE_VM_APPLICATION_NAME: string = 'PTSimpleVM';

		// OPENSTACK VARIABLES
		private static _OPENSTACK_APPLICATION_NAME: string = 'PTOpenStack';

		// WORKSHOP VARIABLES
		private static _WORKSHOP_PROJECT_NAME: string = 'PTWorkshops';
		private static _WORKSHOP_NAME: string = 'PTWS';

		// INSTANCES VARIABLES
		private static _INSTANCES_PROJECT_NAME: string = 'PTInstances';
		private static _BASIC_VM_NAME: string = 'PTBasic';
		private static _VOLUME_VM_NAME: string = 'PTVolume';
		private static _VOLUME_NAME: string = 'ProtractorVolume';
		private static _VOLUME_SPACE: string = '1';
		private static _DEFAULT_FLAVOR_TITLE: string = 'de_NBI_default';
		private static _UBUNTU_18_TITLE: string = 'Ubuntu_18_04_LTS_de_NBI__2022-06-17_';
		private static _CWLAB: string = 'cwlab';
		private static _VOLUME_MOUNT_PATH_STRING: string = 'path';
		private static _BASIC_SNAPSHOT_NAME: string = 'PTSnap';
		private static _ALTERNATIVE_SNAPSHOT_NAME: string = 'PTSnapTwo';
		private static _RESENV_URL: string = 'PTResenvUrl';
		private static _RESENV_VM_NAME: string = 'PTResenv';

		// GENERAL VARIABLES
		private static _PI_EMAIL: string = 'test@test.com';
		private static _ONE_MINUTE_TIMEOUT: number = 60000;
		private static _timeout: number = Util._ONE_MINUTE_TIMEOUT * 2;
		private static _15_MIN_TIMEOUT: number = Util._ONE_MINUTE_TIMEOUT * 15;
		private static _30_MIN_TIMEOUT: number = Util._ONE_MINUTE_TIMEOUT * 30;

		//  VARIABLE GETTERS
		static get PI_EMAIL(): string {
				return this._PI_EMAIL;
		}

		static get CWLAB(): string {
				return this._CWLAB;
		}

		static get DEFAULT_FLAVOR_NAME(): string {
				return this._DEFAULT_FLAVOR_TITLE;
		}

		static get UBUNTU_18_TITLE(): string {
				return this._UBUNTU_18_TITLE;
		}

		static get VOLUME_MOUNT_PATH_STRING(): string {
				return this._VOLUME_MOUNT_PATH_STRING;
		}

		static get ALTERNATIVE_SNAPSHOT_NAME(): string {
				return this._ALTERNATIVE_SNAPSHOT_NAME;
		}

		static get SIMPLE_VM_APPLICATION_NAME_NO_PI(): string {
				return this._SIMPLE_VM_APPLICATION_NAME_NO_PI;
		}

		static get SIMPLE_VM_APPLICATION_NAME(): string {
				return this._SIMPLE_VM_APPLICATION_NAME;
		}

		static get MIN_TIMEOUT_1(): number {
				return this._ONE_MINUTE_TIMEOUT;
		}

		static get MIN_TIMEOUT_15(): number {
				return this._15_MIN_TIMEOUT;
		}

		static get MIN_TIMEOUT_30(): number {
				return this._30_MIN_TIMEOUT;
		}


		static get BASIC_SNAPSHOT_NAME(): string {
				return this._BASIC_SNAPSHOT_NAME;
		}

		static get OPENSTACK_APPLICATION_NAME(): string {
				return this._OPENSTACK_APPLICATION_NAME;
		}

		static get VOLUME_VM_NAME(): string {
				return this._VOLUME_VM_NAME;
		}

		static get BASIC_VM_NAME(): string {
				return this._BASIC_VM_NAME;
		}

		static get VOLUME_NAME(): string {
				return this._VOLUME_NAME;
		}

		static get timeout(): number {
				return this._timeout;
		}

		static get VOLUME_SPACE(): string {
				return this._VOLUME_SPACE;
		}

		static get WORKSHOP_NAME(): string {
				return this._WORKSHOP_NAME;
		}

		static get WORKSHOP_PROJECT_NAME(): string {
				return this._WORKSHOP_PROJECT_NAME;
		}

		static get INSTANCES_PROJECT_NAME(): string {
				return this._INSTANCES_PROJECT_NAME;
		}

		static get RESENV_URL(): string {
				return this._RESENV_URL;
		}

		static get RESENV_VM_NAME(): string {
				return this._RESENV_VM_NAME;
		}

		static by_data_test_id_str(data_test_id: string): string {
				return `[data-test-id="${data_test_id}"]`;
		}

		static by_data_test_id_str_prefix(data_test_id: string): string {
				return `[data-test-id ^=${data_test_id}]`;
		}


		static async clickByDataTestIdStr(page: Page, id_str: string): Promise<void> {
				console.log('Clicking by data-test-id: ' + id_str)
				await page.click(Util.by_data_test_id_str(id_str))

		}

		static async consoleLogCurrentUrl(page: Page): Promise<void> {
				const url = await page.url();//get the url of the current page
				console.log('Current Url: ' + url)
		}
}
