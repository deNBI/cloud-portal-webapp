

#### Bug Fixes

* **Credits:** fixed in modification and fixed application detail layout ([0204b5a5](0204b5a5))

#### Features

* **Application:** added user data input ([d209e1e6](d209e1e6))
* **Dissemination:**
  * merged to denbi platforms ([3688b9d3](3688b9d3))
  * all btn added ([ff1414e3](ff1414e3))
* **Instance:**  one filter for all fields ([bebcf425](bebcf425))
* **application-form:**  add text for sensitive data ([8e6e0f79](8e6e0f79))
* **instance-overview:**
  *  quick UDP Connect Information added ([945e4c36](945e4c36))
  *  Instance overview clearer and faster to use ([3ba32002](3ba32002))

##  (2019-11-14)


#### Bug Fixes

* **add-member:** button layout fixed ([c176951c](c176951c))
* **userinfo:** same column width for chrome and firefox ([f7b2d6c5](f7b2d6c5))
* **new instance:** bar animated
  
#### Fatures

* **news:** feature(fm-mail): checkbox if post news
* **vo-overview:** filter wait for confirmation projects
* **snapshot:** updated info


##  (2019-11-07)


#### Bug Fixes

* **ImageTag:** - and _ allowed ([75d88051](75d88051))

##  (2019-11-06)

#### Bug Fixes
* **Icons:** icons path fixed ([4b29f947](4b29f947))
* **Placeholder:** NDA to NA ([a8a88e9f](a8a88e9f))
* **add-vm:**  conda checks working correctly, reset for new proje… (#843) ([a23af7f5](a23af7f5))
* **instance-overview:**  correct status check after deleting vm ([ba34aff9](ba34aff9))

##  (2019-10-31)


#### Features

* **Instance:**  if mutex locked wait 1 second ([7aaa5a3e](7aaa5a3e))
* **Tests:** added dissemination test ([3b7c9c9d](3b7c9c9d))
* **tests:** added edam test ([c1aa6fb5](c1aa6fb5))

#### Bug Fixes

* **Liniting:** fixed linting errors ([bbecbafa](bbecbafa))
* **e2e:**  vm tests fixed ([7ac504f6](7ac504f6))
* **mod-request:**  notify what is missing (#830) ([8010ac6e](8010ac6e))
* **modification:**
  *  current lifetime wrong year (#823) ([c62166ba](c62166ba))
  *  notification about modification without prolonging lifetime (#824) ([4c20bd92](4c20bd92))
* **sidebar:**  truncate project name in case it is to long for sidebar (#827) ([d707f5bb](d707f5bb))
* **type-overview:**  add back css for hover over image ([a4ce6cff](a4ce6cff))
* **userinfo:**  change positions and margins (#829) ([01f0e614](01f0e614))


##  (2019-10-24)


#### Bug Fixes

* **Client:** if no client online return ([0bbf9668](0bbf9668))
* **Theming:**  simplevm icons showing for faciliy manager ([98b20bca](98b20bca))
* **how-to-connect:**  conda - dl buttons below text ([f7791d1f](f7791d1f))
* **vm:**  can check status on active vm, show ssh on failed playbooks ([cf79a914](cf79a914))

#### Features

* **Project:** simple vm cc chooseable ([2f3ae85a](2f3ae85a))
* **Userinfo:**  pubkey always visisble , added copy btn ([7971d8fe](7971d8fe))


## (2019-10-23)

### Bug Fixes

* **Theming:** Adjusted scroll area of main part
* **Theming:** Fixed minimized logo issues
* **Theming:** Icons for projects now showing in minimized sidebar


## (2019-10-21)

#### Bug Fixes

* **New Project:** Marked Reserch Topics as mandatory field

## (2019-10-20)

#### Bug Fixes

* **Projects:** Fixed missing projects in sidebar


##  (2019-10-18)

#### Bug Fixes

* **Theming:** quickfix for styling issues, typo removed, changed button layout for member overview ([0f9442c](0f9442c))
* **Theming:** webkit-based browser issues fixed ([5f13ed4](5f13ed4))
* **Instance:** missing warning for insufficient choices added ([0142e1c](0142e1c))

##  (2019-10-16)


#### Features

* **Edam:** at elast one tag neded ([03c0b610](03c0b610))
* **Flavor:** when set show comment ([4c404b77](4c404b77))
* **Image:** added logos ([5f1973b9](5f1973b9))
* **Instance:** refactored how to connect modal ([1e47e2ca](1e47e2ca))

#### Bug Fixes

* **Modification:** object storage set and core and ram ([4b77278b](4b77278b))
* **project-icons:**  look better now ([4e83d522](4e83d522))
* **vm-overview:**  popups vanish after 3 seconds ([c70f03d7](c70f03d7))



##  (2019-10-11)


#### Bug Fixes

* **Applications:** fixed spinner ([1d92d917](1d92d917))
* **Terminate:** compute center will be saved ([410faf35](410faf35))
* **vm-overview:**  popover arrow aligned, popup on mouseenter, close on mouseenter and clickoutside ([eb3788eb](eb3788eb))

##  (2019-10-09)

#### Features

* **newsletter:**  added dsgvo info (#747) ([bc01b8f4](bc01b8f4))

### Bug fixes

* **package.json:**  fix coreui/angular to version 2.4.5, fix coreui/coreui to version 2.1.8 

##  (2019-10-08)


#### Bug Fixes

* ***.ts:** changed permission to a-x to all ts.files) ([a1e6ff09](a1e6ff09))
* **AddVM:**  fixed typo ([95880099](95880099))
* **Application:**
  * fixed approve bug ([0147842d](0147842d))
  * message ([46e5c690](46e5c690))
  * added GB and removed special hardware ([208dcd4c](208dcd4c))
  * fixed Application invittion ([9d8ee919](9d8ee919))
  * fixed ram gb ([b813ca8f](b813ca8f))
* **Applications:**
  * reload single applcation perun_approved now set ([03b7a1d2](03b7a1d2))
  *  single-> simple ([fe58adf8](fe58adf8))
  * project => application renamed ([3fa085f0](3fa085f0))
  * project => application renamed ([a17b79ed](a17b79ed))
  * fixed facilityid error ([e9d9feba](e9d9feba))
  * fixed initialisation bug ([06ba55f3](06ba55f3))
  * removed number of vms ([8f98e228](8f98e228))
  * fixed shared bug ([efbe2e57](efbe2e57))
  * fixed simple vm flavors ([ee0eef26](ee0eef26))
  * fixed request bug ([dffd364c](dffd364c))
  *  refresh fixed ([4d2f682c](4d2f682c))
  * Single vm to simple vm ([2ce6f62e](2ce6f62e))
  * fixed changed facility bug ([292e0eb4](292e0eb4))
* **InsOverview:**  Fixed Bootstrap bug ([5f704f81](5f704f81))
* **Instance:** added pointer slection ([299f959b](299f959b))
* **InstanceOverview:**
  * fixed paginatioN ([0ddd64ac](0ddd64ac))
  *  paging also for non vos ([bdeae4a5](bdeae4a5))
* **Layout:** dropdown reworking ([7dbdf359](7dbdf359))
* **LifeTimeDays:**  again Math.ceil ([0ca857ba](0ca857ba))
* **Lifetime:** fixed dateCreated etc in projects overviews (#500) ([a0a882c1](a0a882c1))
* **Limits:**  cant send empty request, automati parsing 2,3 to 2.4 etc ([aff81529](aff81529))
* **Loop:**
  * fixed ([a3a58964](a3a58964))
  * next try ([301295ad](301295ad))
* **Makefile:**  remove check for /etc/hosts (#737) ([bb9ea22b](bb9ea22b))
* **MemberGuard:** fixed ping pong redirect ([4ddb8202](4ddb8202))
* **Members:** fixed remove all members bug ([7aa4aa26](7aa4aa26))
* **Modification:** fixed html bug ([edbc049f](edbc049f))
* **ModificationHeadlines:**  headlines aligned ([c74148e8](c74148e8))
* **Modifications:** lifetime can be 0 ([fa8bad5e](fa8bad5e))
* **Overview:**
  * fixed erro ([493473ba](493473ba))
  * aligned buttons ([5a0bcd06](5a0bcd06))
* **Popover:** now id is copyable ([43c6f970](43c6f970))
* **Projects:**
  * admin cant kick himself anymore ([fbd2e636](fbd2e636))
  * fixed typo ([44cf7548](44cf7548))
  * suspend working again ([d952c9bf](d952c9bf))
  * suspend working again ([24284c92](24284c92))
* **Protractor:**
  * fixed btn bugs ([da24c6e2](da24c6e2))
  * fixed btn bugs ([f8901aa5](f8901aa5))
* **PublicKey:**  remove newline characterets from publickey ([7a014599](7a014599))
* **README:**  remove executable right on files ([46cd9255](46cd9255))
* **Reboot:** fixed reboot bug ([d85f579b](d85f579b))
* **Renewal:** volume bug fixed ([f2931d77](f2931d77))
* **Resource:**  to pdf /csv ([59a139ae](59a139ae))
* **Resources:**
  * fixed small bug ([6e69ba29](6e69ba29))
  * fixed totalGpu ([e5f1295c](e5f1295c))
* **ServiceWorker:**
  * deactivated ([aba49666](aba49666))
  * import matsnackbar ([b9f15227](b9f15227))
  * added to provider ([b3aa65e3](b3aa65e3))
* **Snapshot:** removed needless calls ([97d00d9c](97d00d9c))
* **Table:** fixed an table ([33343445](33343445))
* **TestButton:**
  *  openstack  test applicaiton btn works again ([bd35ac09](bd35ac09))
  *  openstack  test applicaiton btn works again ([af144f05](af144f05))
  *  simple vm test applicaiton btn works again ([9bf983a7](9bf983a7))
* **Userinfo:**  changed buttons ([bb3d7615](bb3d7615))
* **VM:** fixed diskspace bug ([a3cd6b1e](a3cd6b1e))
* **VirtualMachine:**
  * start btn disabled if no image or flavor is selected, also do not show  please choose info if starting a vm isnt possible ([034a3130](034a3130))
  * choose not visisbile anymoore when bioconda is selected ([80d8aa2f](80d8aa2f))
  * choose not visisbile anymoore when bioconda is selected ([f7c47340](f7c47340))
* **Virtualmachine:** not timeout when stopping or resuming vm ([20b21092](20b21092))
* **Vm:** fixed button bug ([2ddfccef](2ddfccef))
* **Volumes:**
  * fixed another parsing bug ([76c195da](76c195da))
  * fixed response parsing ([3ceeeb37](3ceeeb37))
* **Wiki:** fixed wiki link ([f22fad0e](f22fad0e))
* **add-vm:**  form not invalid anymore if no no., remove table-re… (#748) ([8d1b8907](8d1b8907))
* **addProjects:**  storage limit disabled for # of volumes == 0 ([2b545ad9](2b545ad9))
* **addmember:**  changed the ui for add member ([15efad7f](15efad7f))
* **allignment:**  fix modal alignment (#113) ([cc35c19a](cc35c19a))
* **angular:**
  *  changed prod to production ([091b8f95](091b8f95))
  *  fixed angular bug ([613079dd](613079dd))
  * fixed anguar json (#202) ([3cd8c245](3cd8c245))
  * fixed anguar json ([673b6c83](673b6c83))
* **api-connector:**
  * deletet wrong params from key service ([17051193](17051193))
  *  fixed encoding '+' ([9c705939](9c705939))
  *  fixed urls for flav,img and vm service ([9e11c2ce](9e11c2ce))
* **applcations:**  cant checkConnection to Client anymore with empty host and emtpy port ([3ad07fc2](3ad07fc2))
* **application:**
  *  enter does not submit form anymore ([398429d7](398429d7))
  *  Applications does not get submitted accidentally when pressing Enter ([bcb86bd5](bcb86bd5))
  *  lifetime and numbers get loaded ([39018551](39018551))
  *  Modification Request - Number of requested Flavors now showing ([2d299dc5](2d299dc5))
  *  small typo ([bf1038d8](bf1038d8))
  *  form requirements fixed ([3225a1c6](3225a1c6))
  *  missing placeholders ([f0276bfa](f0276bfa))
  *  MB to GB ([0701e9c5](0701e9c5))
  * fixed loading bug ([46b417bd](46b417bd))
  *  volume counter no longer gb ([75a74c6b](75a74c6b))
  * also refresh allapp ([cae5c66d](cae5c66d))
  *  add missing unit values ([e381981c](e381981c))
  *  resources title updated to h5 ([a18142a8](a18142a8))
  *  fix typo ([9bcaf45b](9bcaf45b))
  *  changed formular to form ([0255283f](0255283f))
  * fixed comma ([5ec85541](5ec85541))
  *  show cores in application summary ([af4dd30b](af4dd30b))
  * fied typo ([8b9816e9](8b9816e9))
* **application-model:**
  *  typo in variable name removed (#719) ([2938bb5e](2938bb5e))
  *  typo in variable name removed (#719) ([b18825fd](b18825fd))
* **applicationHistoryButtons:**  Buttons more responsive to screen size ([cfbf0f2a](cfbf0f2a))
* **applications:**
  *  declined applications removable by user (#740) ([b29c772f](b29c772f))
  * fixed table ([af1a392a](af1a392a))
  * fixed list bug ([c0f82d12](c0f82d12))
  * fixed type bug ([97449ff0](97449ff0))
  * removed call ([d2360950](d2360950))
  * highlite bug (#87) ([a84d6f0d](a84d6f0d))
  *  now checks if there is a value for the project fields, if not wont send null anymore ([320eecff](320eecff))
  *  removed changes in addaplication ([0bb2cffb](0bb2cffb))
  *  fixed vm overview merge) ([407e65e8](407e65e8))
  *  removed break is_vo_admin ([098089b9](098089b9))
  * small fix in addvm ([9867d6b8](9867d6b8))
  * converted stopped at timestamp to dat fixe ([e5aefc6f](e5aefc6f))
  * converted stopped at timestamp to date ([e5c7e1aa](e5c7e1aa))
  * commit befre ws wrong,fixed reload bug ngfor ([d91630c0](d91630c0))
  * fixed key bug stat_server ([db5a8fdc](db5a8fdc))
  * just vo-manager can see the cleints now ([483be344](483be344))
  *  fixed responsive table ([5ad113de](5ad113de))
  *  fixed responsive table ([a853d456](a853d456))
* **assignRessource:** fixed assignRessource error if no cc is set (#77) ([50eabfb3](50eabfb3))
* **bioconda:**  Prevent unwanted adding of tools by Enter key (#652) ([212c9f31](212c9f31))
* **bug:**
  *  fixed bug where you cant open projects ([bd57ef7d](bd57ef7d))
  *  fixed missing semicolon ([e15917c3](e15917c3))
* **bugfix:**  changed mouseover to balloon, resized application form, fixed button overlap in instance overvire ([54b5a092](54b5a092))
* **build:**  fix build (#131) ([f42fd3eb](f42fd3eb))
* **checkboxes:** fixed checkboxes (#58) ([4ae3cfe2](4ae3cfe2))
* **cloud_application:**  fix submit button ([16d0d3ed](16d0d3ed))
* **computecenters:**  if you select a compute center it wont be changed vor all other ([45ddeedd](45ddeedd))
* **consent:** added point ([59cd045f](59cd045f))
* **cursor:**  added pointer cursor to all modals ([42d771b1](42d771b1))
* **deployment:**
  *  use different environments ([d3420bb4](d3420bb4))
  *  use different environments ([d7449353](d7449353))
* **description:**  changed information do details ([18738a5e](18738a5e))
* **dev:**  merging ([5f5194e5](5f5194e5))
* **development:**  remove nvmrc file ([ba1c8707](ba1c8707))
* **docker:**
  *  use docker image field in env file ([2ccaca4b](2ccaca4b))
  *  use docker image field ([645896b5](645896b5))
  *  test cache tag ([a547c9cd](a547c9cd))
  *  hooks env now with bash ([3f056b3d](3f056b3d))
  *  user cache tag ([431dbbaa](431dbbaa))
* **dockerhub:**  changed --env to --configuration ([b4a35ad0](b4a35ad0))
* **dropdown:** dropdowns now close if clicked outside (#252) ([d7006017](d7006017))
* **dropdowns:**  all dropdowns working again ([c5945cf5](c5945cf5))
* **email:**  fixed modal assignment ([cf5a612d](cf5a612d))
* **extension:** fixed extensin bug ([36627eb1](36627eb1))
* **facility:**
  * reload projects if facility changed ([159f0305](159f0305))
  * if shortname is empty use name (#102) ([3767bbaa](3767bbaa))
* **facility error:**  selectedfacility not needed here ([0828e5bd](0828e5bd))
* **filter:**
  * now really an or ([d7281a69](d7281a69))
  * fixed type bug ([e395157e](e395157e))
* **flavor:**
  * fixed + in ephermal ([2b35da16](2b35da16))
  * fixed + in ephermal ([38f559b6](38f559b6))
* **flavors:** fixed flavors ([2e4093c7](2e4093c7))
* **group:**
  * added header ([197c1d2c](197c1d2c))
  * added / to regex ([121b3ebd](121b3ebd))
  * added / to regex ([437eb961](437eb961))
* **group.service:**  added missing srf token ([da496d1d](da496d1d))
* **groups:** fixed bug ([8994ecd2](8994ecd2))
* **help:**
  *  reply to now required (#179) ([e591dcb9](e591dcb9))
  *  added reply to ([abc50963](abc50963))
  *  added response field ([bd3bdf3b](bd3bdf3b))
  *  removed contact button ([0dd4c4c0](0dd4c4c0))
  *  fix error ([63a115ad](63a115ad))
* **hooks:**  reverted hooks file ([d5e7f474](d5e7f474))
* **html2canvas:**
  *  pin version ([357e31c8](357e31c8))
  *  pin version ([a4e5d7d7](a4e5d7d7))
* **image-tags:**  now only allows tag names without special characters (#705) ([1733945c](1733945c))
* **import:**  removed double import ([c02a5ae5](c02a5ae5))
* **instance_name:**  remove async name check (#649) ([182818b9](182818b9))
* **ioverview:**  fixed buttons ([925aace1](925aace1))
* **jsnlog:**  remove test button in userinfo ([a7e9adff](a7e9adff))
* **layout:**
  * fixed routeractive to exact ([710d0af6](710d0af6))
  * fixed typo" ([0a5e3652](0a5e3652))
  * small fix ([56501601](56501601))
  *  fixed private permission ([c6c9a083](c6c9a083))
* **layouts:**  removed unused imports ([244e58cc](244e58cc))
* **link:** fixed link to https://cloud.denbi.de (#160) ([226a8af9](226a8af9))
* **logo:**
  *  swapped core ui to denbi logo ([ea64ab90](ea64ab90))
  *  swapped core ui to denbi logo ([63ae97ea](63ae97ea))
  *  swapped core ui to denbi logo ([b9dac96b](b9dac96b))
  *  swapped core ui to denbi logo ([6fce1eb7](6fce1eb7))
* **logout:**  removed logout from dev instance ([7f0b19d9](7f0b19d9))
* **loop:** remove cookie ([7246038b](7246038b))
* **makefile:**  remove unnecessary fi ([d80beca3](d80beca3))
* **members:**
  *  now you can remove members again ([1c549568](1c549568))
  *  now you can remove members again ([c7651ee2](c7651ee2))
* **merge:**
  *  merged dev into master ([936782e2](936782e2))
  * fixed } ([72f46b2d](72f46b2d))
  * fixed } ([a97c8d68](a97c8d68))
  * fixed } ([76777055](76777055))
  *  fixed mergeconflict ([db4257ad](db4257ad))
* **mod-request:**  remove is pi line in modification requests (#741) ([0a79a6f5](0a79a6f5))
* **modal:**
  *  VM-typo (#744) ([76f9e69d](76f9e69d))
  *  fixed typo ([d7a51f29](d7a51f29))
  *  fixed typo ([9f741754](9f741754))
  *  removed unused line ([b67b74db](b67b74db))
  *  fixed typo in modal ([70001dda](70001dda))
  * now the applicationmodala will be resetted (#142) ([880f6063](880f6063))
* **modals:**  added text to startvm and modal when joining freemium ([19796e27](19796e27))
* **modification:**  Amount of RAM now classified with GB ([32a28d79](32a28d79))
* **name:**
  *  changed font color ([0c4274ef](0c4274ef))
  *  removed unnesessary bootstrap import ([dcb79575](dcb79575))
  *  removed unused userinfo ([307f3f91](307f3f91))
* **new-instance:**  optional parameters not shown when ressources… (#738) ([14178088](14178088))
* **new-instance-alert:**  now correctly showing what is missing ([c8adbc19](c8adbc19))
* **newInstance:** fixed typo ([2d28273b](2d28273b))
* **newserver:**
  * should be visible if client is avaiable and user is pa… (#76) ([246a073d](246a073d))
  *  now if no client is avaible you cant see the new server tab ([efa77ad5](efa77ad5))
* **notificaton:** fixed typo ([347f63eb](347f63eb))
* **overview:**
  *  overview text now in plural ([a2e24098](a2e24098))
  *  show overview only when member of project ([ba6c8fe7](ba6c8fe7))
  *  cast groupid to string ([317ccfa6](317ccfa6))
* **pointer:** fixed newapplication pointer ([31bf1ab5](31bf1ab5))
* **project-overview:**
  *  Buttons for Actions now aligned, table structured with bootstrap-col ([57ba8656](57ba8656))
  *  buttons in member overview now aligned ([f68ead10](f68ead10))
* **project_date:**
  *  fix project date month ([5004ee37](5004ee37))
  *  fix project date month ([3f0e4c44](3f0e4c44))
* **projectoverview:**
  *  overview shows he is member instead of nothing ([17f22e28](17f22e28))
  *  overview shows he is member instead of nothing ([8ae154fe](8ae154fe))
* **projects:**
  * fxied login redirect ([f46b722d](f46b722d))
  * fxied login redirect ([2b38f7da](2b38f7da))
  * fixed group name bug ([d5ae4850](d5ae4850))
  * fixed length property ([b27bf744](b27bf744))
* **proptractor:**
  *  add portal url ([74f11c66](74f11c66))
  *  add portal url ([a2c4096f](a2c4096f))
  *  add portal url ([25a88df8](25a88df8))
* **readme:**
  *  add intellij debug screenshot ([29e94d56](29e94d56))
  *  small change how to serve webapp ([e84c83df](e84c83df))
* **rename:**  renaned de.NBI portal to de.NBI Cloud Portal ([e698c999](e698c999))
* **safar:**  converted date to moment ([f7b187f1](f7b187f1))
* **safari:**
  *  swapped missing dates ([ce20702f](ce20702f))
  *  added responsive tables ([95370079](95370079))
* **serviceWorker:**  delete all serviceWorker mentions (#498) ([e8b4443c](e8b4443c))
* **settings:**
  *  fixed dockerhub settings ([3319a024](3319a024))
  *  removed duplicated settings ([c08b18c4](c08b18c4))
  *  changed dockerhub settings ([76ad1e75](76ad1e75))
  *  use correct url ([84218f44](84218f44))
* **snapshot:**  text for no snapshot available in the middle of the page ([ff77b821](ff77b821))
* **space:**  added space between buttons in project overview ([394421b2](394421b2))
* **storageLimit:**
  *  storage limit row hidden when number equals zero ([a68efe83](a68efe83))
  *  zero submitted if disabled ([a8f308bb](a8f308bb))
* **table:**
  *  changed bootstrap style ([a6452b05](a6452b05))
  *  fix errorf ([eef16eaf](eef16eaf))
  *  added missing ngif ([bfbddceb](bfbddceb))
  *  added 2 dummy lines ([b42f4e67](b42f4e67))
* **title:**  added missing title to sites ([987bcb58](987bcb58))
* **umlauts:**
  *  edited text ([be14c719](be14c719))
  *  only letters and digits are allowed for project application ([10f1c2ba](10f1c2ba))
  *  added text ([251a4a21](251a4a21))
  *  removed console log ([163d6714](163d6714))
  *  added text ([973e19ff](973e19ff))
  *  added parser for short description ([edbe4ff9](edbe4ff9))
* **user-info:**
  *  Layout now not changing due to public key (#723) ([4bab7283](4bab7283))
  *  Layout now not changing due to public key (#723) ([258fe52c](258fe52c))
* **userinfo:**
  *  removed missing functions causing errors in component.html (#552) ([74af4ce2](74af4ce2))
  * fixed type bug ([3b4b9046](3b4b9046))
  * fixed type bug ([00b21839](00b21839))
  * fixed type bug ([80b6b447](80b6b447))
  * fixed typos ([ca4f8aee](ca4f8aee))
  *  fix ssh help link ([2b900b45](2b900b45))
  *  to user information (#94) ([c47364c1](c47364c1))
  *  removed collaps variable ([12919726](12919726))
  *  fixed userinfo design ([84afb6fc](84afb6fc))
* **userinformation:**  break public key) ([95381755](95381755))
* **userservice:**  getfilteredmembers was missing a / ([266c5a58](266c5a58))
* **validations:**  validations working correctly now ([df6ee61a](df6ee61a))
* **virtualmachinemodel:**  added elxiir id and username o vm ([4c144b7d](4c144b7d))
* **vm:**
  *  now stops instead of suspend ([43cd39ed](43cd39ed))
  *  fixed progress bar remoed spinner ([67175bc4](67175bc4))
  * fixed html bugs ([a7b1ff37](a7b1ff37))
  *  merge fixed ([63ba190f](63ba190f))
* **vm-name:**  info which characters usable if error in vm name (#749) ([178cb942](178cb942))
* **vm_start_txt:**  fixed wording when starting with pb (#678) ([f9d5adfc](f9d5adfc))
* **vms:**
  * fixed a typo ([33778f28](33778f28))
  *  fixed bug ([686e93d5](686e93d5))
* **volumes:**
  * fixed type bug ([efc5d096](efc5d096))
  * fixed type bug ([50c05a47](50c05a47))
  * fixed type bug ([dbb42b2a](dbb42b2a))

#### Features

* **Applicaitons:**
  * added pi field ([f32e4a07](f32e4a07))
  * added pi field ([f405e2ab](f405e2ab))
* **Application:**
  * detailed desc text ([615eaaab](615eaaab))
  * detailed desc text ([0eb27725](0eb27725))
  * pi can now see also the application,removed double elixir and random request ([2f7adfd4](2f7adfd4))
  * pi will also be added ([a6fcd4fc](a6fcd4fc))
  * pi will also be added ([19973224](19973224))
  * added elixir ([69367ccc](69367ccc))
  * added test app btn ([2bb07ff0](2bb07ff0))
  * added test app btn ([096b7337](096b7337))
  * added test app btn ([5ebc910b](5ebc910b))
  * added dissemination allowed ([364759fe](364759fe))
  * if not enough ressource shows them ([950ceaa6](950ceaa6))
  * now shows client limits when simple vm is created ([33ca34bd](33ca34bd))
  *  Further informations on extensions ([5a9681ca](5a9681ca))
  * added Additional Information header ([7ef62ec3](7ef62ec3))
  * if without faciltiy approve ([32c47621](32c47621))
  * added report fields ([10fa74df](10fa74df))
  * vo can approve without facility ([2624391f](2624391f))
* **Applications:**
  * approve & create reenabled ([5726323c](5726323c))
  * fixed reload ([76f31645](76f31645))
  * fixed single vm flavors ([1981cd46](1981cd46))
  * removed special hardware2 ([c701f3c6](c701f3c6))
  * added history ([2402e70d](2402e70d))
  * now with modificaion ([50a37394](50a37394))
  * now with modificaion ([18e5f22f](18e5f22f))
  * changed to horizon 2020 ([337e6e14](337e6e14))
  * added arrow ([d5bc23c5](d5bc23c5))
  * added dissemination ([8cc6f986](8cc6f986))
  * added european project ([051b7359](051b7359))
  * added GPU ([e86db6cf](e86db6cf))
  * added to pdf ([b73bb305](b73bb305))
* **Approval:** added pi approval endpoints ([5cfbb87d](5cfbb87d))
* **Bioconda:** added bioconda build status ([4d9a26fe](4d9a26fe))
* **CHANGELOG:**
  * added changeog ([79fd80cf](79fd80cf))
  * added changeog ([1b8bec8e](1b8bec8e))
* **CI:**  test docker build on travis ([56578d23](56578d23))
* **Client:**
  * able to change host and port ([f14e1442](f14e1442))
  *  removed delete btn ([14a4f35e](14a4f35e))
* **Clients:**
  * updated responses ([c2eedb23](c2eedb23))
  * limits serialier added ([95272e44](95272e44))
* **Conda:** added also conda forge and anaconda ([36894367](36894367))
* **Development:**  settings for development added ([b9236c7c](b9236c7c))
* **Dissemination:**
  * added first public endpoint ([8505209e](8505209e))
  * also added for simple vm ([bb80495a](bb80495a))
  * added diss model ([74ea0ddf](74ea0ddf))
* **Dockerfile:** changed to 8.11 alpine ([d34fe5a0](d34fe5a0))
* **Email:**
  * facility manager now can send emails to specific projects (#493) ([fa10a27e](fa10a27e))
  * facility manager now can send emails to specific projects ([615d28ac](615d28ac))
  * added for vo ([834dc5e2](834dc5e2))
  * splitted in projects ([a57020c1](a57020c1))
  * updated emails ([329fc239](329fc239))
* **Facility:**
  * add facility llimits ([00c39caf](00c39caf))
  * added resurces voerview ([7e0cd7e4](7e0cd7e4))
* **Factors:** added add delete method ([c4ee6e35](c4ee6e35))
* **Flavors:**
  *  selected flavor always on the left ([46c628e2](46c628e2))
  * now fold out ([db916ae5](db916ae5))
  * now fold out ([0685b2f2](0685b2f2))
  * foldout ([89c57111](89c57111))
  * now public url ([446afeb5](446afeb5))
  * added flavor to simple vm ([455540bb](455540bb))
* **Images:** selected always to the left ([a98fd5bd](a98fd5bd))
* **Ioverview:**  adapted design ([a6fc9822](a6fc9822))
* **Jenkins:**
  *  added Jenkinsfile for pr ([2b713681](2b713681))
  *  added rm command to save space ([d76f49e7](d76f49e7))
  *  added Jenkinsfile and makescript to portal ([bd23914a](bd23914a))
* **Linting:** added classes ([3931cbc4](3931cbc4))
* **Localhost:**  local using localhost ([7683e661](7683e661))
* **Login:** if user wasn't logged in and requests a site ,he will be redirectet to the site after login ([28329345](28329345))
* **Members:**
  * Facility manager  also sees email ([94e0f784](94e0f784))
  * Facility manager  also sees email ([cadd2226](cadd2226))
  * Vo also sees email ([432ca841](432ca841))
* **Modification:**
  * now with summarize ([eae4c9be](eae4c9be))
  * removed required from flavors ([8245d4c0](8245d4c0))
  * simple vm again ([66bd7743](66bd7743))
* **OIDC:**  settings for using oidc added ([356b4103](356b4103))
* **PR:**
  *  wiki and readme to pull request template added ([ff47696a](ff47696a))
  *  added responsive section ([9acbfb45](9acbfb45))
* **PR_TEMPLATE:**
  * added description ([2ddf8840](2ddf8840))
  *  if requirements changed check patch" (#250) ([26c6254b](26c6254b))
* **Project:** now copy linkt to clipboard ([afc0b180](afc0b180))
* **ProjectHash:** useing url params ([0cf59e48](0cf59e48))
* **Projects:**
  * added delete members method ([74052b1f](74052b1f))
  * added checkbox for all members ([8d19fc2e](8d19fc2e))
  * now with terminated ([2fb243d7](2fb243d7))
* **Protractor:**
  * updated conf ([2123ee8f](2123ee8f))
  * updated conf ([f49737bc](f49737bc))
  * added environment to gitignore and added env.dist ([f0823728](f0823728))
  * added environment to gitignore and added env.dist ([8003da68](8003da68))
  * updated test and conf ([1a43955f](1a43955f))
  * updated test and conf ([9048d470](9048d470))
  * updated test ([b69d407f](b69d407f))
  * updated test ([cb2a4f5f](cb2a4f5f))
* **Protrector:**
  * own folder added script ([b7493982](b7493982))
  * own folder added script ([6a91a60a](6a91a60a))
  * updated test ([841ac224](841ac224))
  * updated test ([50334787](50334787))
* **PublicKey:** added word break ([00311444](00311444))
* **README:**  add explanation for debug configuration in intellij ([f61aaf0c](f61aaf0c))
* **Reboot:** added VM_REBOOT ([62df75c0](62df75c0))
* **Resource:** added class ([402ed103](402ed103))
* **Resources:**
  *  added info limits just for denbi ([18fff39a](18fff39a))
  * updated ([91b5be49](91b5be49))
  * added date ([849fe58b](849fe58b))
  * added csv convert ([7daf6d7e](7daf6d7e))
  * now at vo listet for all facilities ([089b70fb](089b70fb))
  * addet to vo ([01b391fb](01b391fb))
  * added resources overview method ([c939d0c6](c939d0c6))
* **SecurityGroups:** added udp conneciton info ([66b3754f](66b3754f))
* **SecurtyGroup:** added checkbox for udp,http,https ([ae48d149](ae48d149))
* **Service:** removed settings ([92829292](92829292))
* **ServiceWorker:**
  * fix 2 ([fd06f63a](fd06f63a))
  * added service worker ([f639a489](f639a489))
* **SimpleVm:** submit disabled if not atleast 1 flavor ([fe0b144f](fe0b144f))
* **Snapshot:**
  * added facility selection ([b318c4ea](b318c4ea))
  * added status badges ([27665ec4](27665ec4))
  * added a snapshot name check ([db50a063](db50a063))
* **Tables:** all responsive ([c3d90d8a](c3d90d8a))
* **Tests:** added terminate tests ([ed93a332](ed93a332))
* **Tslin:**
  * updated config ([82241a59](82241a59))
  * updated config ([fdada1e9](fdada1e9))
  * updated config ([80ac835b](80ac835b))
  * updated config ([01f00430](01f00430))
  * updated config ([8bf90c3e](8bf90c3e))
  * updated config ([09fc03a8](09fc03a8))
  * updated config ([2fe1a38b](2fe1a38b))
* **User:** changed responses ([0acc6d1c](0acc6d1c))
* **Userinfo:** changed to welcome ([45f5d29c](45f5d29c))
* **Validation:**
  *  flavor and total cores/ram shown ([05b78313](05b78313))
  *  closing validation modal redirects to /applications ([602e5579](602e5579))
  *  header, sidebar shown in val. page, pi name and email shown in application information ([ebfd1409](ebfd1409))
  * added method to validate btn, added modal ([10413c08](10413c08))
  * added 404 ([86298ca8](86298ca8))
  * first prototype of valdiation site ([9293a5a9](9293a5a9))
  * added validation component ([7179db06](7179db06))
* **VirtualMachine:**
  * added flavor and instance id popover to vm overvieew ([8124db39](8124db39))
  * if volumes full warning ([71382068](71382068))
* **VirtualMachines:**
  * added small loader when selecting a project, progressbar background darkgray ([ca8dc693](ca8dc693))
  * added info when no flavor is available ([ef02eeda](ef02eeda))
  * added overview ([40b484d9](40b484d9))
* **Virtualmachines:**
  * added filtering ([36c38d8c](36c38d8c))
  * addet warning ([b5253bb6](b5253bb6))
  * addet warning ([58e64dbd](58e64dbd))
* **Vm:** make modal big when active ([1ea76f21](1ea76f21))
* **VmOverview:**
  * asking status forom OpenStack ([75d35ac6](75d35ac6))
  * Connect modal bigger,refresh button ([0954c78d](0954c78d))
* **Vms:**
  * started adding real pagination ([35d68180](35d68180))
  * now visible for pi ([04dd2383](04dd2383))
* **Vo:** now shows facility of projects ([309b54b3](309b54b3))
* **Volume:** added wiki link ([8f5ee8f1](8f5ee8f1))
* **Volumes:** just volume owner can change the volume ([d6e63b84](d6e63b84))
* **addVM.component:**
  * added basic GUI for creating Vms ([6f3c92ff](6f3c92ff))
  * added basic GUI for creating Vms ([df30dc85](df30dc85))
* **add_member:** first version of filter ([803be2eb](803be2eb))
* **affiliations:** added affillaitions application (#222) ([5e511394](5e511394))
* **api-connector:**
  * changed keyservice for new connecor -key function ([3219bccb](3219bccb))
  *  get all vms per openm ([708b88cc](708b88cc))
  *  resuem vm ([730d2706](730d2706))
  * added get vms all method ([ef763926](ef763926))
  * round robin cliens ([64fb3752](64fb3752))
  * round robin cliens ([117bbee7](117bbee7))
  *  added metadata at vm_create ([33e879a9](33e879a9))
  *  flavor,image,virtualmachine services now connecting with django ([911a360e](911a360e))
  *  flavor,image,virtualmachine services now connecting with django ([0edff824](0edff824))
* **app:**  added member-guard which checks before routing if user is member of the denbivo' ([9e5e5ae2](9e5e5ae2))
* **appliaiton:**  cores/VM or cores ([2108d671](2108d671))
* **application:**
  *  user gets info about possibility to request specia… (#594) ([d4369078](d4369078))
  *  add reporting field in application ([958e3cfc](958e3cfc))
  * added max lifetime 12 ([aadc2d4f](aadc2d4f))
  * small logic change ([14ec3cfb](14ec3cfb))
  * added loadder ([a7dae458](a7dae458))
  * now also a vo can delete applicaitons form history (#172) ([4a8b6ace](4a8b6ace))
  *  shorten notification message ([7f4ba9bc](7f4ba9bc))
  *  added info (#56) ([89ddffa3](89ddffa3))
  * added project to vm ([80ad6464](80ad6464))
* **applicationform:**  replace list with checkboxes ([7589ac68](7589ac68))
* **applications:**
  * added error message ([8d21fb68](8d21fb68))
  * changed form to md 9 ([e5413e43](e5413e43))
  * if not member of vo cant be approved for group ([146b454a](146b454a))
  * remove footer after closing ([a0c4d0a4](a0c4d0a4))
  * if single vm project you cant choose an compute center anymore ([bc658a06](bc658a06))
  *  application history now shows also facilitys ([6d6e9d4e](6d6e9d4e))
  *  changed filter visual and added public key validation! ([1580fdd2](1580fdd2))
  * removed username from vm overwiev ([48667620](48667620))
  *  just approved projects ([f8556286](f8556286))
  * added warning field for testing ([b2c3b008](b2c3b008))
  *  addded ssh_command ([803dddc9](803dddc9))
  * added delete vm method ([4babe368](4babe368))
  * added project when starting vm ([92865ba6](92865ba6))
  *  added filter to vmOverwie ([77d10071](77d10071))
  *  added filter to vmOverwie ([4dc30c1d](4dc30c1d))
  *  added more field to vm ([0d28d489](0d28d489))
  *  added information for flavors ([27c8d323](27c8d323))
  *  changes to vmClients optic ([c88c0d7f](c88c0d7f))
  *  visual update client overview ([4c258f5a](4c258f5a))
  * added vmCLients with methods ([7eeea6af](7eeea6af))
  *  changed tablelayout, removed keys ([64719c26](64719c26))
  *  added Image description ([7abc24d4](7abc24d4))
  * addvm.component.html  Metadatatabeldesign changed ([353e235b](353e235b))
  *  metadatatabel invis if no metadata ([a72b2116](a72b2116))
  *  fixed key bug and changed design ([cf828980](cf828980))
  *  added methods add and delete MetadataItem to addvm.component ,added html for representing the metadatalist) ([fd7e7d7f](fd7e7d7f))
  * addvm.component.html  Metadatatabeldesign changed ([015dba3f](015dba3f))
  *  metadatatabel invis if no metadata ([a3ec2db3](a3ec2db3))
  *  fixed key bug and changed design ([93d231d5](93d231d5))
  *  added methods add and delete MetadataItem to addvm.component ,added html for representing the metadatalist) ([af2216cb](af2216cb))
* **applicaton:**
  * now it shows in the modal which inputs where wrong (#143) ([015d99ba](015d99ba))
  * now it shows in the modal which inputs where wrong ([3697c3fd](3697c3fd))
* **applicatons:** added refresh button ([dd3015b3](dd3015b3))
* **applictation:**
  *  added ssd comment information (#709) ([a3404500](a3404500))
  *  added ssd comment information (#709) ([9a6d4eaf](9a6d4eaf))
* **bioconda:**  declared as beta ([7e297e3c](7e297e3c))
* **client:**
  * now checks version featuress ([229a6881](229a6881))
  * if no client left with resources return error message ([3ddbda73](3ddbda73))
* **cloud-application:** user now has the ability to choose quantity of VMs of each specific type and can check the entered data during application-process ([5d77a563](5d77a563))
* **command:**  changed command output ([3b95e56a](3b95e56a))
* **consent:** added onsent info page (#232) ([619da353](619da353))
* **coreui:** updated (#199) ([83952633](83952633))
* **date:** added date (d/m/y) (#216) ([a1f7e9da](a1f7e9da))
* **deployment:**
  *  deployment updated ([6b448020](6b448020))
  *  deployment updated ([6396bda4](6396bda4))
  *  deployment updated ([f653f840](f653f840))
  *  deployment updated ([659ea31f](659ea31f))
  *  deployment updated ([71f412ba](71f412ba))
* **description:**
  * description in modal ([f3a2588d](f3a2588d))
  * now the perun attribute will be set (#91) ([d71c2d44](d71c2d44))
* **dev:**  set travis lint test ([0c20ec24](0c20ec24))
* **developemnt:**  add nvm commands ([d314fda1](d314fda1))
* **development:**
  *  use nodeenv instead of nvm ([c779b872](c779b872))
  *  reduce needed command ([3932bee7](3932bee7))
* **dissemination:**  combined options into one accordion splitted by headlines ([60215b64](60215b64))
* **docker:**
  *  create staging container ([2edd987b](2edd987b))
  *  create staging container ([57279523](57279523))
* **docs:** some changes ([0090f377](0090f377))
* **emai:** get to post ([140c0b2c](140c0b2c))
* **email:**
  * added method and modal to change preferred email (#258) ([b646490a](b646490a))
  * changed to form validation ([2f14b4ca](2f14b4ca))
  * added reply field ([0abed2f7](0abed2f7))
  *  fixed margin top/bot ([0a8dcb25](0a8dcb25))
  *  fix email ([015be75b](015be75b))
  *  added feedback modal ([89c26b7e](89c26b7e))
* **environment:**
  *  provide and document environment for dev stage and production ([55f95742](55f95742))
  *  provide and document environment for dev stage and production ([3064d0e4](3064d0e4))
  *  provide and document environment for dev stage and production ([57017651](57017651))
  *  provide and document environment for dev stage and production ([94d83e0f](94d83e0f))
* **exceptionHandling:**
  *  added first exceptionhandling to start_vm ([a29f4694](a29f4694))
  *  added first exceptionhandling to start_vm ([7ef0d4bd](7ef0d4bd))
* **extension:** added extension declined (#181) ([494a104a](494a104a))
* **fac_mail:**
  *  some logic fixes ([7db8c8e8](7db8c8e8))
  *  added modals for facilitymail ([405af545](405af545))
* **facility:**
  * now in the client overview it is a dropdown for the fa… (#72) ([8b46322d](8b46322d))
  *  show facility details ([babaea70](babaea70))
  *  added default value to selectbox ([34b51c65](34b51c65))
  *  added default value to selectbox ([741606d5](741606d5))
  *  selection for computecenter ([94880223](94880223))
* **feedback:**  added feedback to freemium modal ([4f6e9e5d](4f6e9e5d))
* **flavor:** added flavor type model ([9786dd96](9786dd96))
* **flavors:**
  * name of flavors in form set ([094a5378](094a5378))
  * added gpi,ephermal disk and type to model ([df29ff86](df29ff86))
  * flavors now listed with nummeric selector ([974fa332](974fa332))
  * showas namess ([d0580337](d0580337))
* **freemium:**
  * changed some calls (#218) ([8539ce2e](8539ce2e))
  * implemented working freemium (#215) ([23e0ce77](23e0ce77))
* **github:**  new pr-template (#502) ([b3c0c18b](b3c0c18b))
* **group:** now admin of a group can add other admins,he can promot m… (#150) ([0e45502b](0e45502b))
* **groups:** added realname ([7499cbbd](7499cbbd))
* **groupservice:** added groupservice ([4027aa64](4027aa64))
* **help:**
  *  added email button and functionality ([41c961a9](41c961a9))
  *  added help button ([9064c4fc](9064c4fc))
  *  added route to help site ([5614d32c](5614d32c))
  *  help text is now popover ([8ad55ba5](8ad55ba5))
  *  changed text ([8195ba53](8195ba53))
  *  changed text ([8b368dee](8b368dee))
  *  changed help text ([463d9a50](463d9a50))
  *  added icons to input fields ([1653e264](1653e264))
* **icons:** changed icons (#166) ([e093225c](e093225c))
* **installation:**  use correct dev settings ([9bd62ee0](9bd62ee0))
* **invitation_links:**
  *  reference to invitation links wiki page added ([4519dbf3](4519dbf3))
  *  reference to invitation links wiki page added ([8f40d6ce](8f40d6ce))
* **issue:**  created template for feature issues ([9c1691f1](9c1691f1))
* **key:**
  * done ([2b7cf01d](2b7cf01d))
  * own module ([9fcf945f](9fcf945f))
  *  added elixir_id as keyname ([c7124bb9](c7124bb9))
* **keys:**  some improvements ([5e0b18b3](5e0b18b3))
* **label:**
  *  added text to other infobox ([725722b4](725722b4))
  *  added info field for beta version) ([9195eb86](9195eb86))
* **license:**  add license ([fcb89fe8](fcb89fe8))
* **lifetme:** now also a pi can see the lifetime of his projects (#151) ([f6b3b489](f6b3b489))
* **logo:**
  *  changed logo to new logo ([1bfd956f](1bfd956f))
  *  added new logo to scss file ([0e7cc270](0e7cc270))
* **mail:** added servcie to send mail ([25ba5b86](25ba5b86))
* **member:**
  * add and remove member without facility ([6dde0b61](6dde0b61))
  * add and remove member without facility ([6a541c80](6a541c80))
* **memberguard:** also for children ([431e0f86](431e0f86))
* **members:**
  * added elixir id (#214) ([b0e923ec](b0e923ec))
  *  now possible to remove members if facility is set (#38) ([8276ccd0](8276ccd0))
* **modification-request:**  Updating the request-modal ([26078e90](26078e90))
* **name:**  added login name to top right ([f5cfbed4](f5cfbed4))
* **newsletter:**
  * added description ([7e9ae9d2](7e9ae9d2))
  * now vo sees how many newsletter subscriptionsexist (#146) ([54440145](54440145))
  * added newsletter fiedl to userinfo (#133) ([74cf0daa](74cf0daa))
* **notification:** added wait notification (#93) ([66afc78d](66afc78d))
* **overview:**
  * need to merge dev into this branch,now shows the old modal when there is no facility set for the project ([00ab247d](00ab247d))
  * added core ui elements and also some more text ([cc1c4f0a](cc1c4f0a))
  *  modal bigger now ([1b32c158](1b32c158))
  *  reused modal which informs if user could be added ([59360d26](59360d26))
  *  now you can add the filtered members.. ([481c283f](481c283f))
  *  rest filtertMembers if modal is closed ([86e90e35](86e90e35))
* **paging:**
  * vms per page 5 ([9999933f](9999933f))
  * now filter is also on the fly ([697e25f8](697e25f8))
* **params:** now the optional params are hidden in the start vm tab (#136) ([4fdcc76b](4fdcc76b))
* **perun-connector:** addded attribute-manager ([e6c44730](e6c44730))
* **project:**
  * added expiration date (#170) ([c7652561](c7652561))
  * changed to simple vm project ([331b6df3](331b6df3))
* **projectmanamgement:** now shows the facilitys ([eaa42bb6](eaa42bb6))
* **projects:**
  * role member ([252e93c7](252e93c7))
  * prefilled the required values like ram etc (#106) ([6263ab92](6263ab92))
* **propagation:** mvoed add member and remove member to server ([16fa5128](16fa5128))
* **proptractor:**
  *  use environment.json instead of environment.dist.json ([2d8a8e40](2d8a8e40))
  *  use environment.json instead of environment.dist.json ([baeda44e](baeda44e))
  *  use environment.json instead of environment.dist.json ([b433c646](b433c646))
* **publickey:**  changed button to show and hide ([97bb75ae](97bb75ae))
* **pull_request:**  pull request template added (#191) ([e71971f4](e71971f4))
* **question:**  now question sign is hand ([e8475a84](e8475a84))
* **reboot:**
  * added methods ([02ec9237](02ec9237))
  * added methods ([c6c777fe](c6c777fe))
  * added html ([b6e2a3e1](b6e2a3e1))
* **registration:**  opens in new tab ([090f6acc](090f6acc))
* **registration-info:**  updatet the visual ([a1c3003e](a1c3003e))
* **resources_manager:** added resorucesmanager ([edd43d6a](edd43d6a))
* **security:**  added missing credentials and csrf tokens ([13a26464](13a26464))
* **session:**  intercept error in http requests ([0cc72334](0cc72334))
* **shortname:** nwo creates perun group with sshortname ([ca0fdeaa](ca0fdeaa))
* **snap:**
  *  added link to snapshot wiki ([80f6d58d](80f6d58d))
  *  show message if no snap is available ([595e5f7f](595e5f7f))
* **snapshot:** added description ([c3e16ad6](c3e16ad6))
* **ssh:**  opens in new tab (#103) ([a22bb02a](a22bb02a))
* **symbol:**  added loading gif ([55247326](55247326))
* **tags:**
  *  changed tag to variables ([564b64aa](564b64aa))
  *  added legend with possible tags ([381ec461](381ec461))
* **user:** user mail and name to application (#227) ([ba806a19](ba806a19))
* **userinfo:**
  *  added linked logo for user meeting ([c9357f22](c9357f22))
  * added please ([9bb413dd](9bb413dd))
  *  public key is now changeable ([c4cef20d](c4cef20d))
  *  added ElixirID to suerinfo ([9311179c](9311179c))
* **validation:**  dissemination showing correctly, approve&create disabled and info if pi not approved ([453a6b49](453a6b49))
* **version:** show volumes if version is right ([b1fc647b](b1fc647b))
* **virtualmachinemodel:**
  *  gloating_ip ([b4c6c1de](b4c6c1de))
  *  added elxiir id and username o vm ([2125ddde](2125ddde))
* **virtualmachnemodels:**  desciption field added to image ([3bd1cd40](3bd1cd40))
* **vm:**
  *  warning just comes if client is offline ([30972511](30972511))
  *  first show of userinfo on vm tab ([d74d49ef](d74d49ef))
  * added status badges ([e15258e5](e15258e5))
  *  remove testing label ([7bc4b7ff](7bc4b7ff))
* **vmoverview:**  admin tab for all instances ([fbda6be7](fbda6be7))
* **vo:**
  * added function to send mail to whole vo (#168) ([e4f6626e](e4f6626e))
  * vo overview now shows all groups (#147) ([4eb66c9c](4eb66c9c))
* **volume:** added rename volume function (#217) ([8b76e2d6](8b76e2d6))
* **volumes:** more space betweeen crate button ([94741268](94741268))
* **wiki:**  added wiki to help page ([215b7915](215b7915))


##  (2019-09-23)


#### Bug Fixes

* **Popover:** now id is copyable ([51e5b032](51e5b032))


##  (2019-09-12)


#### Bug Fixes

* **vm**  fix stop bug

##  (2019-09-10)


#### Bug Fixes

* **application:**  enter does not submit form anymore ([510fa96b](510fa96b))
* **modification:**  Amount of RAM now classified with GB ([ea851630](ea851630))


##  (2019-09-03)


#### Bug Fixes

* **project-overview:**  Buttons for Actions now aligned, table structured with bootstrap-col ([029085ec](029085ec))
* **instance-overview** Instances sync with openstack

##  (2019-08-19)


#### Bug Fixes

* **instance_name:**  remove async name check (#649) ([904703a4](904703a4))


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
