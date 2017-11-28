// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) ***REMOVED***
  config.set(***REMOVED***
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:***REMOVED***
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    ***REMOVED***,
    files: [
      ***REMOVED*** pattern: './src/test.ts', watched: false ***REMOVED***
    ],
    preprocessors: ***REMOVED***
      './src/test.ts': ['@angular/cli']
    ***REMOVED***,
    mime: ***REMOVED***
      'text/x-typescript': ['ts','tsx']
    ***REMOVED***,
    coverageIstanbulReporter: ***REMOVED***
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    ***REMOVED***,
    angularCli: ***REMOVED***
      environment: 'dev'
    ***REMOVED***,
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'coverage-istanbul']
              : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  ***REMOVED***);
***REMOVED***;
