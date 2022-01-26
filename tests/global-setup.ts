import { chromium, FullConfig } from '@playwright/test';
import environment from './environment.json';
import { LoginPagePlaywright } from './page_objects/login.po';

export const FACILITY_MANAGER_STORAGE: string = 'facilityManagerStorageState.json';
export const MEMBER_STORAGE: string = 'memberStorageState';
export const VO_MANAGER_STORAGE: string = 'voManagerState.json';

async function globalSetup(config: FullConfig) {
	const { baseURL } = config.projects[0].use;
	const browser = await chromium.launch();
	const voPage = await browser.newPage();
	const login = new LoginPagePlaywright(voPage, baseURL);
	console.log('Create VO Manager Session');
	await login.login(environment.email_vo, environment.password_vo, environment.auth_vo);
	await voPage.context().storageState({ path: VO_MANAGER_STORAGE });
	const facilityManagerPage = await browser.newPage();
	console.log('Create Facility Manager Session');

	const facilityLogin = new LoginPagePlaywright(facilityManagerPage, baseURL);
	await facilityLogin.login(environment.email_fm, environment.password_fm, environment.auth_fm);
	await facilityManagerPage.context().storageState({ path: FACILITY_MANAGER_STORAGE });
	const memberPage = await browser.newPage();
	console.log('Create Member Session');

	const memberLogin = new LoginPagePlaywright(memberPage, baseURL);
	await memberLogin.login(environment.email_user, environment.password_user, environment.auth_user);
	await memberPage.context().storageState({ path: MEMBER_STORAGE });
	await browser.close();

}

export default globalSetup;
