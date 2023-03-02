import {chromium, FullConfig} from '@playwright/test';
import environment from './environment.json';
import {LoginPagePlaywright} from './page_objects/login.po';

const FACILITY_MANAGER_STORAGE = 'facilityManagerStorageState.json';
const MEMBER_STORAGE = 'memberStorageState';
const VO_MANAGER_STORAGE = 'voManagerState.json';

/**
 * Global setup
 * @param config config
 */
async function globalSetup(config: FullConfig) {
		const {baseURL} = config.projects[0].use;
		const browser = await chromium.launch();
		const [voPage, facilityManagerPage, memberPage] = await Promise.all([
				browser.newPage(),
				browser.newPage(),
				browser.newPage(),
		]);

		try {
				console.log('Create VO Manager Session');
				const voLogin = new LoginPagePlaywright(voPage, baseURL);
				const voStorageState = voPage.context().storageState({
						path: VO_MANAGER_STORAGE,
				});
				const voLoginPromise = voLogin.login(
						environment.email_vo,
						environment.password_vo,
						environment.auth_vo
				);

				console.log('Create Facility Manager Session');
				const facilityLogin = new LoginPagePlaywright(facilityManagerPage, baseURL);
				const facilityStorageState = facilityManagerPage.context().storageState({
						path: FACILITY_MANAGER_STORAGE,
				});
				const facilityLoginPromise = facilityLogin.login(
						environment.email_fm,
						environment.password_fm,
						environment.auth_fm
				);

				console.log('Create Member Session');
				const memberLogin = new LoginPagePlaywright(memberPage, baseURL);
				const memberStorageState = memberPage.context().storageState({
						path: MEMBER_STORAGE,
				});
				const memberLoginPromise = memberLogin.login(
						environment.email_user,
						environment.password_user,
						environment.auth_user
				);

				await Promise.all([
						voLoginPromise,
						voStorageState,
						facilityLoginPromise,
						facilityStorageState,
						memberLoginPromise,
						memberStorageState,
				]);

				const context = voPage.context();
				await context.tracing.start({screenshots: true, snapshots: true});
				await context.storageState({path: VO_MANAGER_STORAGE});
				await context.tracing.stop({
						path: './test-results/chromium/setup-trace.zip',
				});
		} catch (error) {
				const context = voPage.context();
				await context.tracing.stop({
						path: './test-results/chromium/failed-setup-trace.zip',
				});
				throw error;
		} finally {
				await browser.close();
		}
}

export default globalSetup;
