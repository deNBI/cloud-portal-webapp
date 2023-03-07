import {defineConfig, devices} from '@playwright/test';
import environment from './tests/environment.json';

export const MEMBER_STORAGE: string = 'memberStorageState.json';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
		testDir: './tests',
		/* Maximum time one test can run for. */
		timeout: 60000 * 10,
		expect: {
				/**
				 * Maximum time expect() should wait for the condition to be met.
				 * For example in `await expect(locator).toHaveText();`
				 */
				timeout: 30000,
		},
		/* Run tests in files in parallel */
		fullyParallel: true,
		/* Fail the build on CI if you accidentally left test.only in the source code. */
		forbidOnly: !!process.env.CI,
		/* Retry on CI only */
		retries: process.env.CI ? 2 : 0,
		/* Opt out of parallel tests on CI. */
		workers: process.env.CI ? 1 : undefined,
		/* Reporter to use. See https://playwright.dev/docs/test-reporters */
		reporter: process.env.CI
				? [
						['github'],
						[
								'html',
								{
										open: 'never',
										outputFolder: 'playwright-html-report',
								},
						],
				]
				: [['html', {open: 'never', outputFolder: 'playwright-html-report'}]],		/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
		use: {
				/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
				actionTimeout: 0,
				/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
				// trace: 'on-first-retry',
				baseURL: environment.portal,
				screenshot: 'on',
				video: 'on',
				trace: 'on',
				// headless: false,
		},

		/* Configure projects for major browsers */
		projects: [
				{name: 'setup', testMatch: /.*\.setup\.ts/},
				{
						name: 'chromium',
						use: {
								...devices['Desktop Chrome'],

								// Use prepared auth state.
						},
						dependencies: ['setup'],
				},

				{
						name: 'firefox',
						use: {...devices['Desktop Firefox']},
						dependencies: ['setup'],

				},

				{
						name: 'webkit',
						use: {...devices['Desktop Safari']},
						dependencies: ['setup'],

				},

		],

		/* Folder for test artifacts such as screenshots, videos, traces, etc. */
		outputDir: 'test-results/',


});
