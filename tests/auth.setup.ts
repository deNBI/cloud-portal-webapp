import {chromium, test as setup} from '@playwright/test';
import {LoginPagePlaywright} from './page_objects/login.po';
import environment from './environment.json';
import {Util} from './util';


setup('authenticate as VO', async ({page,baseURL}) => {
		console.log(baseURL)
		console.log('Create VO Manager Session');
		const login = new LoginPagePlaywright(page, baseURL);

		await login.login(environment.email_vo, environment.password_vo, environment.auth_vo);
		await page.context().storageState({path: Util.VO_MANAGER_STORAGE});


});


setup('authenticate as FM', async ({page,baseURL}) => {
		console.log('Create FM Manager Session');
		const login = new LoginPagePlaywright(page, baseURL);

		await login.login(environment.email_fm, environment.password_fm, environment.auth_fm);
		await page.context().storageState({path: Util.FACILITY_MANAGER_STORAGE});


});

setup('authenticate as User', async ({page, baseURL}) => {
		console.log(baseURL);
		console.log('Create Member Session');
		const login = new LoginPagePlaywright(page, baseURL);

		await login.login(environment.email_user, environment.password_user, environment.auth_user);
		await page.context().storageState({path: Util.MEMBER_STORAGE});


});
