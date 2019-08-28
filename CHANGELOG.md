##  (2019-08-19)


#### Features

* **Conda:** added also conda forge and anaconda ([04d094fe](04d094fe))
* **Dissemination:**
  * added first public endpoint ([a5beb0fc](a5beb0fc))
  * also added for simple vm ([2562e619](2562e619))
  * added diss model ([5f59f90c](5f59f90c))
* **VirtualMachine:** added flavor and instance id popover to vm overvieew ([879b0270](879b0270))
* **dissemination:**  combined options into one accordion splitted by headlines ([8fb3f23f](8fb3f23f))


##  (2019-08-08)


#### Bug Fixes

* **Virtualmachine:** not timeout when stopping or resuming vm ([db519ca2](db519ca2))
* **Wiki:** fixed wiki link ([b580fb40](b580fb40))
* **vm:**  now stops instead of suspend ([39e7c45f](39e7c45f))

##  (2019-07-24)


#### Features

* **Bioconda:** added bioconda build status ([4642cd00](4642cd00))
* **Virtualmachines:** added filtering ([0aacd14e](0aacd14e))
* **Vms:** started adding real pagination ([7b767c1d](7b767c1d))
* **application:**  user gets info about possibility to request specia… (#594) ([bf6d734b](bf6d734b))

#### Bug Fixes

* **Members:** fixed remove all members bug ([1f7169b9](1f7169b9))
* **Snapshot:** removed needless calls ([9c975432](9c975432))
* **VirtualMachine:**
  * start btn disabled if no image or flavor is selected, also do not show  please choose info if starting a vm isnt possible ([0329c5e3](0329c5e3))
  * choose not visisbile anymoore when bioconda is selected ([dd93071e](dd93071e))
  * choose not visisbile anymoore when bioconda is selected ([edb08d43](edb08d43))
* **new-instance-alert:**  now correctly showing what is missing ([0999f734](0999f734))

##  (2019-07-23)


#### Bug Fixes

* **VirtualMachine:**
  * choose not visisbile anymoore when bioconda is selected ([dd93071e](dd93071e))

#### Features

* **Virtualmachines:** added filtering ([0aacd14e](0aacd14e))
* **Vms:** started adding real pagination ([7b767c1d](7b767c1d))
* **application:**  user gets info about possibility to request specia… (#594) ([bf6d734b](bf6d734b))

##  (2019-07-10)


#### Features

* **Flavors:**  selected flavor always on the left ([4d96a1e1](4d96a1e1))
* **Images:** selected always to the left ([e5f9d8ad](e5f9d8ad))
* **Projects:**
  * added delete members method ([c857ee4d](c857ee4d))
  * added checkbox for all members ([c6efd4f5](c6efd4f5))
* **Volumes:** just volume owner can change the volume ([f2dae278](f2dae278))
* **snapshot:** added description ([35899335](35899335))


##  (2019-06-27)


#### Features

* **bioconda:**  declared as beta ([1a600650](1a600650))
* **github:**  new pr-template (#502) ([5b3ff3a0](5b3ff3a0))
* **userinfo:**  added linked logo for user meeting ([486c409c](486c409c))
* **flavors:** added cards and carousel
* **images** added images and carousel


##  (2019-06-17)



#### Features

* **VirtualMachines:** tabs should load faster

#### Bug Fixes

* **TestButton:**
  *  openstack  test applicaiton btn works again ([b0bb967c](b0bb967c))
  *  simple vm test applicaiton btn works again ([d768120f](d768120f))

* **Loop:**
  * fixed the loop


#### Features

* **VirtualMachines:** added small loader when selecting a project, progressbar background darkgray ([ff3de0c2](ff3de0c2))


##  (2019-06-05)


#### Features

* **VirtualMachines:**
  * added info when no flavor is available ([58e7af3e](58e7af3e))
  * added overview ([094ba18c](094ba18c))


##  (2019-06-03)


#### Features

* **Email:**
  * facility manager now can send emails to specific projects (#493) ([43990b4b](43990b4b))

#### Bug Fixes

* **Lifetime:** fixed dateCreated etc in projects overviews (#500) ([8c5df4f2](8c5df4f2))
* **html2canvas:**  pin version ([ab3fd928](ab3fd928))




##  (2019-05-29)


#### Bug Fixes

* **serviceWorker:**  delete all serviceWorker mentions (#498) ([06a15db6](06a15db6))

##  (2019-05-28)


#### Bug Fixes

* **application:**
  *  lifetime and numbers get loaded ([263b168c](263b168c))
  *  Modification Request - Number of requested Flavors now showing ([d825fc22](d825fc22))
* **readme:**  add intellij debug screenshot ([edccae7d](edccae7d))


##  (2019-05-24)


#### Features

* **Application:**
  * detailed desc text ([2b8c7de9](2b8c7de9))
  * detailed desc text ([f7caeaed](f7caeaed))
* **SecurityGroups:** added udp conneciton info ([20b9d3d2](20b9d3d2))
* **SecurtyGroup:** added checkbox for udp,http,https ([8f06062b](8f06062b))

#### Bug Fixes

* **Projects:** fixed typo ([25ca93e8](25ca93e8))
* **ServiceWorker:** deactivated ([c1cc87d5](c1cc87d5))
* **Volumes:**
  * fixed another parsing bug ([81d2fa89](81d2fa89))
  * fixed response parsing ([837e1eac](837e1eac))
* **readme:**  small change how to serve webapp ([e4ba7675](e4ba7675))


##  (2019-05-10)
#### Bug Fixes
* **makefile:**  remove unnecessary fi ([cee3c715](cee3c715))

#### Features

* **Login:** if user wasn't logged in and requests a site ,he will be redirectet to the site after login ([1ff7a05a](1ff7a05a))



##  (2019-05-02)

#### Bug Fixes

* **Applications:** reload single applcation perun_approved now set ([6abdd875](6abdd875))
* **application:**  small typo ([2f28eabb](2f28eabb))



##  (2019-04-29)


#### Bug Fixes

* **Applications:**
  *  single-> simple ([8571bf39](8571bf39))
  * project => application renamed ([9b5ba7f6](9b5ba7f6))

#### Features

* **Applicaitons:**
  * added pi field ([ebebef3f](ebebef3f))
  * added pi field ([5203dbc0](5203dbc0))
* **Application:**
  * pi can now see also the application,removed double elixir and random request ([a120cc32](a120cc32))
  * pi will also be added ([4168b181](4168b181))
  * pi will also be added ([4d4b20af](4d4b20af))
* **Applications:** approve & create reenabled ([8b562d08](8b562d08))
* **Approval:** added pi approval endpoints ([626a57c4](626a57c4))
* **ProjectHash:** useing url params ([889d3e9d](889d3e9d))
* **Validation:**
  *  flavor and total cores/ram shown ([fccf932d](fccf932d))
  *  closing validation modal redirects to /applications ([dfec7a02](dfec7a02))
  *  header, sidebar shown in val. page, pi name and email shown in application information ([5ca44c8d](5ca44c8d))
  * added method to validate btn, added modal ([0fd577d7](0fd577d7))
  * added 404 ([bfb94222](bfb94222))
  * first prototype of valdiation site ([c9f429a7](c9f429a7))
  * added validation component ([c1e81e9b](c1e81e9b))
* **validation:**  dissemination showing correctly, approve&create disabled and info if pi not approved ([a86408b3](a86408b3))




##  (2019-04-17)


#### Bug Fixes

* **AddVM:**  fixed typo ([c580ce7f](c580ce7f))
* **Projects:**
  * suspend working again ([8f519c11](8f519c11))
  * suspend working again ([7a407298](7a407298))
* **addProjects:**  storage limit disabled for # of volumes == 0 ([264a4985](264a4985))
* **applicationHistoryButtons:**  Buttons more responsive to screen size ([072ba746](072ba746))
* **storageLimit:**
  *  storage limit row hidden when number equals zero ([c63a855d](c63a855d))
  *  zero submitted if disabled ([6c8ec01a](6c8ec01a))



##  (2019-04-11)


#### Features

* **Clients:** updated responses ([312b44e1](312b44e1))
* **Linting:** added classes ([2a73e3ed](2a73e3ed))
* **PR_TEMPLATE:** added description ([e376e8f1](e376e8f1))
* **Resources:**
  *  added info limits just for denbi ([97b43fa8](97b43fa8))
  * updated ([a3307fe9](a3307fe9))
* **SimpleVm:** submit disabled if not atleast 1 flavor ([6e8efed8](6e8efed8))
* **User:** changed responses ([da9752c5](da9752c5))
* **VirtualMachine:** if volumes full warning ([378d260a](378d260a))
* **Volume:** added wiki link ([46a16de9](46a16de9))

#### Bug Fixes

* **InstanceOverview:**  paging also for non vos ([2662bed7](2662bed7))
* **Resource:**  to pdf /csv ([3c1563ed](3c1563ed))



##  (2019-04-04)


#### Features

* **Client:** able to change ##  (2019-04-17)


#### Bug Fixes

* **AddVM:**  fixed typo ([c580ce7f](c580ce7f))
* **Projects:**
  * suspend working again ([8f519c11](8f519c11))
  * suspend working again ([7a407298](7a407298))
* **addProjects:**  storage limit disabled for # of volumes == 0 ([264a4985](264a4985))
* **applicationHistoryButtons:**  Buttons more responsive to screen size ([072ba746](072ba746))
* **storageLimit:**
  *  storage limit row hidden when number equals zero ([c63a855d](c63a855d))
  *  zero submitted if disabled ([6c8ec01a](6c8ec01a))
host and port ([53a75d93](53a75d93))
* **Email:**
  * added for vo ([35de3ebd](35de3ebd))
  * splitted in projects ([1600f987](1600f987))
* **Virtualmachines:**
  * addet warning ([2ac3ab9f](2ac3ab9f))
  * addet warning ([d9a0d01c](d9a0d01c))

#### Bug Fixes

* **Applications:** fixed facilityid error ([2ec8ebe1](2ec8ebe1))
* **validations:**  validations working correctly now ([d96f7ba4](d96f7ba4))



##  (2019-03-29)


#### Features

* **Application:** added elixir ([fcb8eff8](fcb8eff8))
* **Applications:** fixed single vm flavors ([994f7d80](994f7d80))
* **Client:**  removed delete btn ([10b81c1f](10b81c1f))
* **Facility:** add facility llimits ([69cee988](69cee988))
* **Factors:** added add delete method ([4e909b3b](4e909b3b))
* **Modification:** now with summarize ([07b1a77c](07b1a77c))
* **Project:** now copy linkt to clipboard ([a4760e68](a4760e68))
* **Projects:** now with terminated ([4c429f71](4c429f71))
* **Service:** removed settings ([6a004172](6a004172))
* **Tslin:**
  * updated config ([dd3b0d41](dd3b0d41))


#### Bug Fixes

* **Application:**
  * fixed approve bug ([03554947](03554947))
  * message ([3e7e4af3](3e7e4af3))
* **Applications:**
  * fixed initialisation bug ([768e4b8a](768e4b8a))
  * fixed shared bug ([2f890be0](2f890be0))
  * fixed request bug ([fba443d4](fba443d4))




#### Features

* **Applications:**
  * removed special hardware
  * added elixir project
  * added history 
  * now with modificaion at facility tab
  
* **Modification:** now with summarize 
 
* **Flavors:**
  * now flavors fold out

* **Service:** removed perun settings 
* **Tslin:**
  * updated config 

#### Bug Fixes

* **Applications:**
  * fixed request bug




#### Bug Fixes

* **Resources:** fixed small bug 
* **VM:** fixed diskspace bug 
* **Vm:** fixed button bug

#### Features

* **Applications:** added GPU 
* **Flavors:** now public url 
* **PublicKey:** added word break 
* **Resource:** added class 
* **Resources:**
  * added date 
  * added csv convert 
  * now at vo listet for all facilities 
  * addet to vo 
* **VmOverview:**
  * asking status forom OpenStack 
  * Connect modal bigger,refresh button 
* **license:**  add license 



### Bug Fixes

* **Applications:** Single vm to simple vm 
* **Modification:** fixed html bug (
* **Overview:** aligned buttons 

#### Features

* **Application:**
  * added test app btn 
* **Applications:** added to pdf 
* **Email:** updated emails
* **Facility:** added resources overview 
* **Modification:** removed required from flavors 
* **Resources:** added resources overview method 

## 0.1.0-beta.0.6.0 Release


#### Bug Fixes

* **Modification:** fixed html bug 
* **Overview:** aligned buttons 

#### Features

* **Application:**
  * added test app btn 
* **Email:** updated emails 
* **Modification:** removed required from flavors
* **Application:**
  * if not enough ressource shows them 
  * now shows client limits when simple vm is created 
* **Clients:** limits serialier added 
* **Snapshot:**
  * added status badges 
  * added a snapshot name check 


#### Features

* **Application:**
  *  Further informations on extensions 
  * added Additional Information header 
  * added report fields
* **CI:**  test docker build on travis 
* **Members:**
  * Facility manager  also sees email (
  * Vo also sees email
* **Modification:** simple vm works again
* **Tables:** all responsive 
* **Vm:** make modal big when active 
* **application:**  add reporting field in application
* **invitation_links:**  reference to invitation links wiki page added 
* **member:** add and remove member without facility 
* **modification-request:**  Updating the request-modal 

#### Bug Fixes

* **Table:** fixed an table

----

#### Bug Fixes

* **Application:** fixed ram gb 

#### Features

* **Application:**
  * if without faciltiy approve 
  * vo can approve without facility 
  * added Additional Information header 
  * added report fields 
------
#### Bug Fixes
* **volume:** fixed volume bug
* **development:**  remove nvmrc file 

#### Features

* **applications:**
  * facility applications now with approval
  * now shows cc 
  * now vo also sees wfc status
  * added modal 
  * added facility decline method and reassign 
  * added facility applications overview 
* **approval:** now sets status auf wait for confirmation 
* **development:**  use nodeenv instead of nvm
* **Approval:** added reassign method                                                                    │
* **Filter:**                                                                                                                         │
  * added filter at facility overview                                                                          │
  * added filter at vo overview                                                                     │
  * added filter at vo overview                                                                                 │
* **Lifetime:** added badge                                                                                │
* **approval:** reassign works                                                                         │
* **development:**  use nodeenv instead of nvm                                                                │
* **vo:**                                                                                                                             │
  * fixed vo filter                                                                                  │
                              

##  0.1.0-beta.0.3.4 Release

#### Features

* **developemnt:**  add nodeenv commands 
* **invitation_links:**  reference to invitation links wiki page added 
* **member:** add and remove member without facility 

#### Bug Fixes

* **vms:** fixed a typo 
