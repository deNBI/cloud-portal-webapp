# Cloud Portal Webapplication 

The use of this application is to provide access to the Portal-API and to the Perun API in one Application. 
Simple request, that do not require administrative rights or special previliges can be done directly from the webapplicaiton

## Setup development server
To start the angular developement server on an empty system follow the upcoming steps.

1. Clone the cloud-portal-webapp repository then go into the cloud-portal-webapp folder.
~~~BASH
git clone -b dev https://github.com/deNBI/cloud-portal-webapp.git
cd cloud-portal-webapp
~~~

2. Add this line to your /etc/hosts file 
~~~BASH
127.0.0.1 portal-dev.denbi.de
~~~

3. Install node version manager and node version 8
~~~BASH
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
# follow the commands printed by nvm
nvm install node v8
~~~

4. Install all needed npm packages and angular cli
~~~BASH
npm install 
npm install -g @angular/cli
~~~

5. start the angular server with
~~~BASH
ng serve
~~~

the dev server should run now on portal-dev.denbi.de:8001. The app will automatically reload if you change any of the source files.

## Developement

### Documentation

Use [Compodoc](https://compodoc.app/guides/getting-started.html) to visualize the code written in TypeScript-files. 

### Installation

* If Compodoc is not already installed use npm. It will install Compodoc automatically.
Use the following command in the cloud-portal-webapp directory. 
~~~BASH
npm install
~~~

### Usage

* Comment your code written in TypeScript-files. Comment-syntax is equivalent to Javascript.
Example: 
```javascript
  /**
   * Uses the data from the application form to fill the confirmation-modal with information.
   * @param f the application form with corresponding data
   */
  filterEnteredData(f: NgForm) ***REMOVED***
  ...

```

* Use the following commands to let Compodoc analyze the written code and comments.
Switch to the cloud-portal-webapp directory first.
~~~BASH
npm run compodoc
~~~

* To view the created documentations use your favorite webbrowser (e.g. firefox)
~~~BASH
firefox documentation/overview.html
~~~

### Options:

* Use `--env=stage|production` for using staging or production environment. If no flag is provided, development environment is used. 

* Use `--host` for setting the hostname. (e.g: cloud.denbi.de)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. 

### Options

* Use the `-prod` flag for a production build.

* Use `--env=stage/prod` for setting staging or production environment. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
