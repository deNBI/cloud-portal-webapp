// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
var DisplayProcessor = require('jasmine-spec-reporter').DisplayProcessor;
const {SpecReporter} = require('jasmine-spec-reporter');
const HtmlReporter = require('protractor-beautiful-reporter');
const log4jsGen = require('./log4jsGen');
const DescribeFailureReporter = require('protractor-stop-describe-on-failure');

const fs = require('fs');
let rawdata = fs.readFileSync('e2e/environment.json');
let credentials = JSON.parse(rawdata);


function LogInterceptor(configuration, theme) {
}


LogInterceptor.prototype = new DisplayProcessor();

LogInterceptor.prototype.displaySuite = function (suite, log) {
  log4jsGen.getLogger().info(log);
  return log;
};

LogInterceptor.prototype.displaySuccessfulSpec = function (spec, log) {
  log4jsGen.getLogger().info(log);

  return log;
};

LogInterceptor.prototype.displayFailedSpec = function (spec, log) {
  log4jsGen.getLogger().error(log);

  return log;
};

LogInterceptor.prototype.displayPendingSpec = function (spec, log) {
  log4jsGen.getLogger().info(log);

  return log;
};

LogInterceptor.prototype.displaySummaryErrorMessages = function (spec, log) {
  log4jsGen.getLogger().error(log);

  return log;
};

LogInterceptor.prototype.displaySpecErrorMessages = function (spec, log) {
  log4jsGen.getLogger().error(log);

  return log;
};


exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  params: {
    portal: credentials['portal'],
    angular: credentials['angular'],
    width: credentials["browser_w"],
    height: credentials["browser_h"],
    login: {
      email_user: credentials['email_user'],
      password_user: credentials['password_user'],
			elixir_id_user: credentials['elixir_id_user'],
      email_fm: credentials['email_fm'],
      password_fm: credentials['password_fm'],
      email_vo: credentials['email_vo'],
      password_vo: credentials['password_vo'],
			elixir_id_vo: credentials['elixir_id_vo'],
      auth_user: credentials['auth_user'],
      auth_fm: credentials['auth_fm'],
      auth_vo: credentials['auth_vo']
    }
  },
  suites: {
    pub_key: ['tests/public_key_test.ts',
    ],
    simple_vm_application: [
      'tests/terminate_all_pt.ts',
      'tests/public_key_test.ts',
      'tests/simple_vm_application_test.ts',
      'tests/simple_vm_approval_test.ts',
      'tests/member_test.ts',
      'tests/simple_vm_modification_test.ts',
      'tests/simple_vm_application_modification_approval.ts',
      'tests/simple_vm_extension_test.ts',
      'tests/simple_vm_extension_approval_test.ts',
      'tests/simple_vm_no_pi_test.ts',
      'tests/terminate_all_pt_after.ts',
    ],
    simple_vm_cluster: [
      'tests/terminate_all_pt.ts',
      'tests/public_key_test.ts',
      'tests/simple_vm_application_test.ts',
      'tests/simple_vm_approval_test.ts',
      'tests/cluster_tests.ts',
      'tests/terminate_all_pt_after.ts',
    ],
    simple_vm_vms: [
      'tests/terminate_all_pt.ts',
      'tests/public_key_test.ts',
      'tests/simple_vm_application_test.ts',
      'tests/simple_vm_approval_test.ts',
      'tests/virtual_machine_tests.ts',
      'tests/terminate_all_pt_after.ts',
    ],
    simple_vm_full: [
      'tests/terminate_all_pt.ts',
      'tests/public_key_test.ts',
      'tests/simple_vm_application_test.ts',
      'tests/simple_vm_approval_test.ts',
      'tests/member_test.ts',
      'tests/simple_vm_modification_test.ts',
      'tests/simple_vm_application_modification_approval.ts',
      'tests/simple_vm_extension_test.ts',
      'tests/simple_vm_extension_approval_test.ts',
      'tests/simple_vm_no_pi_test.ts',
      'tests/cluster_tests.ts',
      'tests/virtual_machine_tests.ts',
      'tests/terminate_all_pt_after.ts',
    ],
    cloud_application: [
      'tests/terminate_all_pt.ts',
      'tests/cloud_application_test.ts',
      'tests/cloud_application_approval_test.ts',
      'tests/cloud_application_modification_test.ts',
      'tests/cloud_modification_approval_test.ts',
      'tests/terminate_all_pt_after.ts',
    ],
    all: [
			'tests/terminate_all_pt.ts',
      'tests/public_key_test.ts',
      'tests/simple_vm_application_test.ts',
      'tests/simple_vm_approval_test.ts',
      'tests/member_test.ts',
      'tests/simple_vm_modification_test.ts',
      'tests/simple_vm_application_modification_approval.ts',
      'tests/simple_vm_extension_test.ts',
      'tests/simple_vm_extension_approval_test.ts',
      'tests/simple_vm_no_pi_test.ts',
      'tests/cloud_application_test.ts',
      'tests/cloud_application_approval_test.ts',
      'tests/cloud_application_modification_test.ts',
      'tests/cloud_modification_approval_test.ts',
      'tests/cluster_tests.ts',
      'tests/virtual_machine_tests.ts',
			'tests/create_workshop_test.ts',
			'tests/start_workshop_vms_test.ts',
			'tests/terminate_all_workshops_test.ts',
      'tests/terminate_all_pt_after.ts',
		]
  },

  allScriptsTimeout: 11000,

  capabilities: {
    browserName: 'chrome',
    acceptInsecureCerts: true,
    chromeOptions: {
      args: ["--incognito", "--ignore-certificate-errors", '--headless', '--disable-gpu']
      //args: ["--incognito", "--ignore-certificate-errors"]

    }
  },
  directConnect: true, //uncomment on macOS, also start webserver via webdriver-manager
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 1800000,
    print: function () {
    }
  },
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });


  },
  onPrepare() {
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'test_results/report',
      screenshotsSubfolder: 'screenshots',
      jsonsSubfolder: 'jsons',
      gatherBrowserLogs: true,
      preserveDirectory: false
    }).getJasmine2Reporter());
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: 'pretty',
        displayFailuresSummary: true,
        displayFailuredSpec: true,
        displaySuiteNumber: true,
        displaySpecDuration: true,
        displayErrorMessages: true
      },
      customProcessors: [LogInterceptor]
    }));
    jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()));
    browser.manage().window().maximize();
  },

};
