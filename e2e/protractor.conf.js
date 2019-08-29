// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const fs = require('fs');
let rawdata = fs.readFileSync('e2e/environment.json');
let credentials = JSON.parse(rawdata);

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    params: {
        timeout: credentials['timeout'],
        portal: credentials['portal'],
        angular: credentials['angular'],
        width: credentials["browser_w"],
        height: credentials["browser_h"],
        login: {
            email_user: credentials['email_user'],
            password_user: credentials['password_user'],
            email_fm: credentials['email_fm'],
            password_fm: credentials['password_fm'],
            email_vo: credentials['email_vo'],
            password_vo: credentials['password_vo'],
            auth_user: credentials['auth_user'],
            auth_fm: credentials['auth_fm'],
            auth_vo: credentials['auth_vo']
        }
    },
    allScriptsTimeout: 11000,
    specs: [
        'tests_ts/login_test.ts',
        'tests_ts/simple_vm_application_test.ts',
        'tests_ts/simple_vm_approval_test.ts',
        'tests_ts/member_test.ts',
        'tests_ts/simple_vm_modification_test.ts',
        'tests_ts/simple_vm_application_modification_approval.ts',
        'tests_ts/cloud_application_test.ts',
        'tests_ts/cloud_application_approval_test.ts',
        'tests_ts/cloud_application_modification_test.ts',
        'tests_ts/cloud_modification_approval_test.ts',
        'tests_ts/virtual_machine_tests.ts'
    ],
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: ["--incognito"]
        }
    },
    directConnect: true,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 900000,
        print: function () {
        }
    },
    beforeLaunch: function () {
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });
    },
    onPrepare() {
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
        browser.manage().window().setSize(parseInt(credentials["browser_w"]), parseInt(credentials["browser_h"]));
    }
};
