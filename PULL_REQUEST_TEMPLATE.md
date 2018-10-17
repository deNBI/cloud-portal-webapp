Try to fulfill the following points before the Pull Request is merged:

- [ ] The PR is reviewed by one of the team members.
- [ ] It must be checked if anything in the Readme must be adjusted (development-, production-, setup).
- [ ] It must be checked if any section in the wiki (https://cloud.denbi.de/wiki/) should be adjusted.
- [ ] If the PR is merged in the master then a release should be be made.
- [ ] The PR is responsive on smaller screens.
- [ ] If the requirements.txt have changed, check if the patches still work

For releases only:

- [ ] If the review of this PR is approved and the PR is followed by a release then the .env file 
  in the cloud-portal repo should also be updated. 
- [ ] If you are making a release then please sum up the changes since the last release on the release page using the [clog](https://github.com/clog-tool/clog-cli) tool with `clog -F`
