import { chromium, FullConfig } from '@playwright/test';
import { LoginPagePlaywright } from './page_objects./login.po';

export const FACILITY_MANAGER_STORAGE: string = 'facilityManagerStorageState.json';
export const MEMBER_STORAGE: string = 'memberStorageState';
export const VO_MANAGER_STORAGE: string = 'voManagerState.json';

async function globalSetup(config: FullConfig) {
	const { baseURL } = config.projects[0].use;
	const browser = await chromium.launch();
	const voPage = await browser.newPage();
	await voPage.goto(baseURL);
	const login = new LoginPagePlaywright(voPage);
	console.log('Create VO Manager Session');
	await login.useOrcid('testuserdenbinew@gmail.com', 'testpassword1!');
	await voPage.context().storageState({ path: VO_MANAGER_STORAGE });
	const facilityManagerPage = await browser.newPage();
	await facilityManagerPage.goto(baseURL);
	console.log('Create Facility Manager Session');

	const facilityLogin = new LoginPagePlaywright(facilityManagerPage);
	await facilityLogin.useOrcid('testuserdenbinew@gmail.com', 'testpassword1!');
	await facilityManagerPage.context().storageState({ path: FACILITY_MANAGER_STORAGE });
	const memberPage = await browser.newPage();
	await memberPage.goto(baseURL);
	console.log('Create Member Session');

	const memberLogin = new LoginPagePlaywright(memberPage);
	await memberLogin.useOrcid('testuserdenbinew@gmail.com', 'testpassword1!');
	await memberPage.context().storageState({ path: MEMBER_STORAGE });
	await browser.close();

}

export default globalSetup;
