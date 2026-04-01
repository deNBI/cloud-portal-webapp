import { Page } from '@playwright/test'
import { Util } from '../util'

export class LoginPagePlaywright {
	private readonly TEST_RP_WARNING = 'testSp'
	private readonly TEST_RP_CONTINUE = 'Continue'
	private readonly CONSENT_CONTINUE = 'Yes, continue'
	private readonly AUTHORIZE_BTN_ID = 'authorize-button'

	private readonly ACCEPT_ALL_COOKIES_TEXT = 'Reject Unnecessary Cookies'
	private readonly REGISTER_COMMUNITY_TEXT = 'Register into Life Science Community - Test Environment'
	private readonly OIDC_ACCESS_DENIED_URL = 'https://login.aai.lifescience-ri.eu/oidc/unauthorizedEnvVosGroups'
	private readonly SUBMIT_LIFESCIENCE_TEST_URL =
		'https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=lifescience_test'

	readonly page: Page
	readonly baseURL: string

	constructor(page: Page, baseURL?: string) {
		this.page = page
		this.baseURL = baseURL ?? ''
		console.log('[LoginPage] Initialized with baseURL:', this.baseURL || '(none)')
	}

	async login(email: string, psw: string, authType: 'orcid' | 'google'): Promise<void> {
		console.log(`[LoginPage] Starting login for ${authType} with email: ${email}`)
		await this.page.goto(this.baseURL)
		console.log('[LoginPage] Navigated to base URL (timeout: 30s)')

		if (authType === 'orcid') {
			await this.useOrcid(email, psw)
		} else if (authType === 'google') {
			await this.useGoogle(email, psw)
		}

		console.log('[LoginPage] Login flow completed ✅')
	}

	async useGoogle(email: string, psw: string): Promise<void> {
		console.log('[Google] Starting Google login flow')
		await Util.consoleLogCurrentUrl(this.page, '[Google] Before clicking Google login button')

		try {
			console.log('[Google] Clicking Google login button (wait up to 10s)...')
			await this.page.click('a:has-text("Google")', { timeout: 10000 })
			await Util.consoleLogCurrentUrl(this.page, '[Google] After clicking Google login')
		} catch (err) {
			console.error('[Google] ❌ Click on Google login failed (10s timeout reached):', (err as Error).message)
			throw err
		}

		console.log('[Google] Filling email...')
		await this.page.fill('input[type="email"]', email)
		console.log('[Google] Clicking "Next" for email...')
		await this.page.click('#identifierNext')

		console.log('[Google] Waiting for password field (wait up to 5s)...')
		await this.page.waitForSelector('input[type="password"]', { state: 'visible', timeout: 5000 })
		console.log('[Google] Filling password...')
		await this.page.fill('input[type="password"]', psw)
		console.log('[Google] Clicking "Next" for password (wait up to 5s)...')
		await this.page.click('#passwordNext')

		await Util.consoleLogCurrentUrl(this.page, '[Google] After password submit')
		await this.skipElixirTestWarning()
		await Util.consoleLogCurrentUrl(this.page, '[Google] After skipping test warning')
		console.log('[Google] Waiting for userinfo endpoint (wait up to 30s)...')
		await this.page.waitForURL('**/userinfo', { timeout: 30000 })
		console.log('[Google] ✅ Reached userinfo endpoint')
	}

	async useOrcid(email: string, psw: string): Promise<void> {
		console.log('[ORCID] Starting ORCID login flow')
		await Util.consoleLogCurrentUrl(this.page, '[ORCID] Before clicking ORCID button')

		try {
			console.log('[ORCID] Waiting for ORCID button (wait up to 15s)...')
			await this.page.waitForSelector('a:has-text("ORCID")', { timeout: 15000 })
			console.log('[ORCID] Clicking ORCID login button (wait up to 10s)...')
			await this.page.click('a:has-text("ORCID")', { timeout: 10000 })
			await Util.consoleLogCurrentUrl(this.page, '[ORCID] After clicking ORCID')
		} catch (err) {
			console.error('[ORCID] ❌ ORCID button interaction failed:', (err as Error).message)
			throw err
		}

		await this.acceptAllCookies()
		console.log('[ORCID] Waiting for ORCID sign-in page (wait up to 15s)...')
		await this.page.waitForURL('https://orcid.org/signin**', { timeout: 15000 })

		console.log('[ORCID] Filling ORCID credentials...')
		await this.page.fill('#username-input', email)
		await this.page.fill('#password', psw)
		console.log('[ORCID] Clicking ORCID "Sign In" button (wait up to 10s)...')
		await this.page.click('#signin-button')

		await Util.consoleLogCurrentUrl(this.page, '[ORCID] After ORCID sign-in')
		await this.skipElixirTestWarning()
		await this.skipAccessDenied()
		await this.giveConsent()
		await this.skipElixirTestWarning()
		console.log('[ORCID] Waiting for userinfo endpoint (wait up to 30s)...')
		await this.page.waitForURL('**/userinfo', { timeout: 30000 })
		await Util.consoleLogCurrentUrl(this.page, '[ORCID] Login flow completed ✅')
	}

	async acceptAllCookies(): Promise<void> {
		console.log('[Cookies] Checking for cookie banner (wait up to 5s)...')
		try {
			await this.page.waitForSelector(`text=${this.ACCEPT_ALL_COOKIES_TEXT}`, { timeout: 5000 })
			console.log('[Cookies] ✅ Cookie banner found, clicking "Reject Unnecessary Cookies" (wait up to 5s)...')
			await this.page.click(`text=${this.ACCEPT_ALL_COOKIES_TEXT}`, { timeout: 5000 })
			console.log('[Cookies] Cookies accepted ✅')
		} catch (error) {
			console.log(
				'[Cookies] ⚠️ Cookie banner not present or not accepted (5s timeout reached):',
				(error as Error).message
			)
		} finally {
			await Util.consoleLogCurrentUrl(this.page, '[Cookies] After attempt')
		}
	}

	async skipAccessDenied(): Promise<void> {
		console.log('[AccessDenied] Checking for access denied (wait up to 5s)...')
		try {
			await this.page.waitForURL(this.OIDC_ACCESS_DENIED_URL, { timeout: 5000 })
			console.log('[AccessDenied] ✅ Access denied URL detected')

			console.log('[AccessDenied] Waiting for new registration page (wait up to 15s)...')
			const [newPage] = await Promise.all([
				this.page.context().waitForEvent('page', { timeout: 15000 }),
				this.page.click(`text=${this.REGISTER_COMMUNITY_TEXT}`, { timeout: 10000 })
			])

			await newPage.waitForLoadState()
			await Util.consoleLogCurrentUrl(newPage, '[AccessDenied] New page loaded:')

			console.log('[AccessDenied] Waiting for "Submit" button (wait up to 10s)...')
			await newPage.waitForSelector('text=Submit', { timeout: 10000 })
			console.log('[AccessDenied] Clicking "Apply for Membership" (wait up to 10s)...')
			await newPage.click('button:has-text("Apply for Membership")')
			console.log('[AccessDenied] Registration submitted ✅')
		} catch (error) {
			console.log(
				'[AccessDenied] ⚠️ Not triggered or failed (e.g., access denied page not reached):',
				(error as Error).message
			)
		} finally {
			await Util.consoleLogCurrentUrl(this.page, '[AccessDenied] Back to main page:')
		}
	}

	async giveConsent(): Promise<void> {
		console.log('[Consent] Checking for consent page (wait up to 10s)...')
		try {
			await this.page.waitForURL('**/oidc/auth/authorize**', { timeout: 10000 })
			console.log('[Consent] ✅ Consent page detected')
			console.log('[Consent] Clicking "Yes, continue" (wait up to 5s)...')
			await this.page.click(`text=${this.CONSENT_CONTINUE}`, { timeout: 5000 })
			console.log('[Consent] Consent given ✅')
		} catch (error) {
			console.log('[Consent] ⚠️ No consent page or click failed (10s timeout reached):', (error as Error).message)
		}
		await Util.consoleLogCurrentUrl(this.page, '[Consent] After attempt')
	}

	async skipElixirTestWarning(): Promise<void> {
		console.log('[Elixir] Checking for test warning page (wait up to 5s)...')
		try {
			await this.page.waitForURL(`**/${this.TEST_RP_WARNING}**`, { timeout: 5000 })
			console.log('[Elixir] ✅ Test warning page detected')
			console.log('[Elixir] Clicking "Continue" (wait up to 5s)...')
			await this.page.click(`text=${this.TEST_RP_CONTINUE}`, { timeout: 5000 })
			console.log('[Elixir] Warning skipped ✅')
		} catch (error) {
			console.log('[Elixir] ⚠️ No test warning page found (5s timeout reached):', (error as Error).message)
		}
		await Util.consoleLogCurrentUrl(this.page, '[Elixir] After warning check')
	}
}
