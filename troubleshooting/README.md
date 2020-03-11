# Welcome to the webapp troubleshooting page
Here we list errors, problems, troubles and their (possible) solutions.

##### Common solutions to some problems
- Ran `make` after changes to the package.json?
- `make new_env_and_node` deletes your virtual environment and node_modules folder and creates both anew. Sometimes this helps when third-party packages and modules create problems.

##### Errors with http requests?
Make sure to call API requests like http.get('.../theUrlYouNeed/') instead of http.get('.../theUrlYouNeed'). The last '/' is important when making API calls.

##### Testing does not work because chromedriver or your chrome has a false version?
Currently, the chromedriver updates itself (probably) because of `webdriver-manager update` call when running `npm run e2e`.  
Try running `make new_env_and_nodes`, pinning the chromedriver version in package.json, or updating your chromium/chrome browser to the needed version by chromedriver.  
`https://www.ubuntuupdates.org/ppa/google_chrome` is a third party ppa you may use to update chrome.

##### Some solutions regarding testing
- Do you have an environment.json in your e2e folder? It needs to be filled with login information and the url. Portal key is the url to the portal login, i.e. localhost:8000 or https://staging-url.de/portal, angular is the url to the angular pages, without the #, i.e. localhost:8001 or https://staging-url.de/portal/webapp.
