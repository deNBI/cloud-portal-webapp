import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';

export class FormularPage {
    private timeout: number = browser.params.timeout;
    private until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    private auth = browser.params.login.auth;
    private SUBMIT_BTN: string = "submit_btn";
    private VERIFICATION_BTN: string = "verification_btn";
    private ACKNOWLEDGE_BTN: string = 'acknowledge_approve_btn';
    private NOTIFICATION_REDIRECT_BTN: string = "notification_btn_redirect";

    async submitApplication(): Promise<any> {
        const submitBtn = element(by.id(this.SUBMIT_BTN));
        console.log("Submit Application");

        await browser.driver.wait(this.until.elementToBeClickable(submitBtn)).then(function () {
            submitBtn.click()
        });

        const verificationBtn = element(by.id(this.VERIFICATION_BTN));
        await browser.driver.wait(this.until.elementToBeClickable(verificationBtn), this.timeout).then(function () {
            verificationBtn.click()
        });

        browser.sleep(1000);

        const acknowledgeBtn = element(by.id(this.ACKNOWLEDGE_BTN));
        await browser.driver.wait(this.until.elementToBeClickable(acknowledgeBtn), this.timeout).then(function () {
            acknowledgeBtn.click()

        });

        const redirectBtn = element(by.id(this.NOTIFICATION_REDIRECT_BTN));
        await browser.driver.wait(this.until.elementToBeClickable(redirectBtn), this.timeout).then(function () {
            redirectBtn.click()

        });
        console.log('Submitted Application');

    }

    async navigateToCloudApplication(): Promise<any> {
        console.log("Navigate to CloudApplicaiton form");
        await browser.driver.getCurrentUrl().then(async function (url) {
            console.log('GetUrl: ' + url);
            url = url.substring(0, url.indexOf('#'));
            console.log('SubstringUrl: ' + url);
            console.log('AddedUrl: ' + url + '#/applications/newCloudApplication');
            await browser.driver.get(url + '#/applications/newCloudApplication');

        });
    }

    async navigateToSimpleVmApplication(): Promise<any> {
        console.log("Navigate to SimpleApplication form");

        await browser.driver.getCurrentUrl().then(async function (url) {
            console.log('GetUrl: ' + url);
            url = url.substring(0, url.indexOf('#'));
            console.log('SubstringUrl: ' + url);
            console.log('AddedUrl: ' + url + '#/applications/newSimpleVmApplication');
            await browser.driver.get(url + '#/applications/newSimpleVmApplication');

        });
    }


    async fillFormular(): Promise<any> {

        console.log('Getting form.');
        const form_name = element(by.name('project_application_name'));
        await browser.driver.wait(this.until.presenceOf(form_name), this.timeout).then(async function () {
            // fill  Formular
            element(by.name('project_application_name')).sendKeys('ProtractorTest');
            element(by.name('project_application_shortname')).sendKeys('ProtractorTest');
            element(by.name('project_application_description')).sendKeys('ProtractorTest Description');
            element(by.name('project_application_lifetime')).sendKeys('4');
            element(by.name('project_application_institute')).sendKeys('Proctractor Institute');
            element(by.name('project_application_workgroup')).sendKeys('Proctractor Workgroup');
            element(by.name('project_application_bmbf_project')).sendKeys('BMBF Project');
            element(by.name('project_application_elixir_project')).sendKeys('Elixir Project');
            element(by.id('project_application_de.NBI default')).sendKeys('1');
            element(by.name('project_application_horizon2020')).sendKeys('Horizon2020Project');
            element(by.id('id_project_application_report_allowed')).click();
            element(by.id('dissemination_information_accordion')).click();
            element(by.name('information_public_title_input')).sendKeys("A Public Title");
            element(by.id('public_description_enabled')).click();
            element(by.name('information_description')).sendKeys("A Public Description");
            element(by.id('information_resources_checkbox')).click();
            element(by.id('information_lifetime_checkbox')).click();
            element(by.id('information_project_type_checkbox')).click();
            element(by.id('information_pi_name_checkbox')).click();
            element(by.id('information_institution_checkbox')).click();
            element(by.id('information_workgroup_checkbox')).click();
            element(by.id('information_project_affiliation_checkbox')).click();
            element(by.id('platform_newsletter_checkbox')).click();
            element(by.id('platform_landing_page_checkbox')).click();
            element(by.id('platform_portal_news_checkbox')).click();
            element(by.id('platform_twitter_checkbox')).click();
            element(by.id('project_application_pi_approved_checkbox')).click();
            element(by.id('project_application_responsibility_checkbox')).click();


        });


    }

}
